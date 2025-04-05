import { useEffect, useState } from "react";
import { avalanche, avalancheFuji, sepolia } from "viem/chains";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { encodeFunctionData } from "viem";
import {
  addressToBytes32,
  CIRCLE_DOMAIN_ID,
  DESTINATION_CALLER_BYTES32,
  MAX_FEE_PARAMETER,
  MESSAGE_TRANSMITTER_ADDRESSES,
  TOKEN_MESSENGER_ADDRESSES,
  USDC_ADDRESS,
} from "../../utils/circle";

type Phase = "checkChain" | "approve" | "burn" | "mint" | "completed";
type TransactionStatus = "idle" | "processing" | "success" | "error";

const AggregateAction = ({
  originChain,
  targetChain,
  bridgeAmount,
  currentPhase,
  setCurrentPhase,
}: {
  originChain: number;
  targetChain: number;
  bridgeAmount: bigint;
  currentPhase: Phase;
  setCurrentPhase: (phase: Phase) => void;
}) => {
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address: userAddress, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const { data: sepoliaClient } = useWalletClient({ chainId: sepolia.id });
  const { data: avalancheClient } = useWalletClient({
    chainId: avalancheFuji.id,
  });

  const client = {
    [sepolia.id]: sepoliaClient,
    [avalancheFuji.id]: avalancheClient,
  };

  // Auto-advance phase when chain is correct
  useEffect(() => {
    console.log(chainId, targetChain);
    if (
      (currentPhase === "checkChain" || currentPhase === "") &&
      chainId !== targetChain
    ) {
      setCurrentPhase("approve");
    }
    if (
      (currentPhase === "approve" || currentPhase === "") &&
      chainId === targetChain
    ) {
      setCurrentPhase("checkChain");
    }
  }, [chainId, targetChain, currentPhase]);

  const approveTransaction = async () => {
    if (!client[originChain]) return;
    console.log("Approving USDC transfer...");
    console.log(bridgeAmount);
    const approveTx = await client[originChain].sendTransaction({
      to: USDC_ADDRESS[originChain],
      data: encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "approve",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "approve",
        args: [TOKEN_MESSENGER_ADDRESSES[originChain], bridgeAmount], // Set max allowance in 10^6 subunits (10,000 USDC; change as needed)
      }),
    });

    console.log(`USDC Approval Tx: ${approveTx}`);
  };

  async function burnUSDC() {
    if (!client[originChain]) return;

    const burnTx = await client[originChain].sendTransaction({
      to: TOKEN_MESSENGER_ADDRESSES[originChain],
      data: encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "depositForBurn",
            stateMutability: "nonpayable",
            inputs: [
              { name: "amount", type: "uint256" },
              { name: "destinationDomain", type: "uint32" },
              { name: "mintRecipient", type: "bytes32" },
              { name: "burnToken", type: "address" },
              { name: "destinationCaller", type: "bytes32" },
              { name: "maxFee", type: "uint256" },
              { name: "minFinalityThreshold", type: "uint32" },
            ],
            outputs: [],
          },
        ],
        functionName: "depositForBurn",
        args: [
          bridgeAmount, // AMOUNT
          CIRCLE_DOMAIN_ID[targetChain],
          addressToBytes32(userAddress!),
          USDC_ADDRESS[originChain],
          DESTINATION_CALLER_BYTES32, // Allow any one to call it
          MAX_FEE_PARAMETER,
          1000, // minFinalityThreshold (1000 or less for Fast Transfer)
        ],
      }),
    });

    console.log(`Burn Tx: ${burnTx}`);
    return burnTx;
  }

  async function retrieveAttestation(transactionHash: string) {
    console.log("Retrieving attestation...");
    const origin = CIRCLE_DOMAIN_ID[originChain];
    const url = `https://iris-api-sandbox.circle.com/v2/messages/${origin}?transactionHash=${transactionHash}`;
    while (true) {
      try {
        const response = await fetch(url);
        if (response.status === 404) {
          console.log("Waiting for attestation...");
        }
        const responseData = await response.json();
        if (responseData?.messages?.[0]?.status === "complete") {
          console.log("Attestation retrieved successfully!");
          return responseData.messages[0];
        }
        console.log("Waiting for attestation...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching attestation:", error.message);
        } else {
          console.error("Error fetching attestation:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async function mintUSDC(attestation: any) {
    if (!client[targetChain]) return;

    console.log("Minting USDC on Avalanche Fuji...");
    const mintTx = await client[targetChain].sendTransaction({
      to: MESSAGE_TRANSMITTER_ADDRESSES[targetChain],
      data: encodeFunctionData({
        abi: [
          {
            type: "function",
            name: "receiveMessage",
            stateMutability: "nonpayable",
            inputs: [
              { name: "message", type: "bytes" },
              { name: "attestation", type: "bytes" },
            ],
            outputs: [],
          },
        ],
        functionName: "receiveMessage",
        args: [attestation.message, attestation.attestation],
      }),
    });
    console.log(`Mint Tx: ${mintTx}`);
  }

  const [attestation, setAttestation] = useState<any>(null);

  const handleNextPhase = async () => {
    switch (currentPhase) {
      case "checkChain":
        if (chainId === targetChain) {
          await switchChain({ chainId: originChain });
          setCurrentPhase("approve");
        }
        break;
      case "approve":
        await approveTransaction();
        setCurrentPhase("burn");
        break;
      case "burn":
        const burnTx = await burnUSDC();
        const _attestation = await retrieveAttestation(burnTx as string);
        setAttestation(_attestation);

        setCurrentPhase("mint");
        await switchChain({ chainId: targetChain });
        break;
      case "mint":
        await mintUSDC(attestation);
        setCurrentPhase("completed");
        break;
    }
  };

  const getButtonConfig = () => {
    switch (currentPhase) {
      case "checkChain":
        return {
          text: "Switch Network",
        };
      case "approve":
        return {
          text: "Approve Transaction",
        };
      case "burn":
        return {
          text: "Burn Tokens",
        };
      case "mint":
        return {
          text: "Mint tokens",
        };
      case "completed":
        return {
          text: "All Steps Completed!",

          disabled: true,
        };
      default:
        return {
          text: "Aggregate Action",
          disabled: true,
        };
    }
  };

  const disabledStyle = "bg-gray-300 text-gray-500 cursor-not-allowed";
  const { text, disabled } = getButtonConfig();

  return (
    <>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <button
        className="w-full sm:w-auto px-8 py-2 bg-transparent border-2 border-gray-300 hover:border-blue-600 rounded-xl text-lg font-semibold text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
        onClick={handleNextPhase}
        disabled={disabled}
      >
        {txStatus === "processing" ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Processing...
          </span>
        ) : (
          text
        )}
      </button>
    </>
  );
};

export default AggregateAction;
