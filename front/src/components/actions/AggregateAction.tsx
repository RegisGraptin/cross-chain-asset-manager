import { useEffect, useState } from "react";
import { avalancheFuji, sepolia } from "viem/chains";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { USDC_TESTNET } from "../../utils/tokens";
import { Address, encodeFunctionData } from "viem";
import {
  addressToBytes32,
  AVALANCHE_FUJI_DOMAIN,
  AVALANCHE_FUJI_MESSAGE_TRANSMITTER,
  ETHEREUM_SEPOLIA_DOMAIN,
  ETHEREUM_SEPOLIA_TOKEN_MESSENGER,
  MAX_FEE_PARAMETER,
} from "../../utils/circle";

type Phase = "checkChain" | "approve" | "burn" | "retrieve" | "completed";
type TransactionStatus = "idle" | "processing" | "success" | "error";

const AggregateAction = ({ targetChain }: { targetChain: number }) => {
  const [currentPhase, setCurrentPhase] = useState<Phase>("checkChain");
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const { address: userAddress, chainId } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  const { data: sepoliaClient } = useWalletClient({ chainId: sepolia.id });
  const { data: avalancheClient } = useWalletClient({
    chainId: avalancheFuji.id,
  });

  // Auto-advance phase when chain is correct
  useEffect(() => {
    console.log(chainId, targetChain);
    if (currentPhase === "checkChain" && chainId !== targetChain) {
      setCurrentPhase("approve");
    }
    if (currentPhase === "approve" && chainId === targetChain) {
      setCurrentPhase("checkChain");
    }
  }, [chainId, targetChain, currentPhase]);

  const handleSwitchChain = async (destChain) => {
    setTxStatus("processing");
    try {
      await switchChain({ chainId: destChain.id });
      setTxStatus("success");
    } catch (err) {
      setError(err.shortMessage || err.message);
      setTxStatus("error");
    }
  };

  const approveTransaction = async () => {
    if (!sepoliaClient) return;
    console.log("Approving USDC transfer...");
    const approveTx = await sepoliaClient.sendTransaction({
      to: USDC_TESTNET[sepolia.id] as Address,
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
        args: [ETHEREUM_SEPOLIA_TOKEN_MESSENGER, BigInt(10_000 * 6)], // Set max allowance in 10^6 subunits (10,000 USDC; change as needed)
      }),
    } as Parameters<typeof sepoliaClient.sendTransaction>[0]);

    console.log(`USDC Approval Tx: ${approveTx}`);
  };

  async function burnUSDC() {
    if (!sepoliaClient) return;

    console.log(addressToBytes32(userAddress!));

    console.log("Burning USDC on Ethereum Sepolia...");
    const burnTx = await sepoliaClient.sendTransaction({
      to: ETHEREUM_SEPOLIA_TOKEN_MESSENGER,
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
          BigInt(10_000), // AMOUNT
          AVALANCHE_FUJI_DOMAIN,
          addressToBytes32(userAddress!),
          USDC_TESTNET[sepolia.id] as Address,
          addressToBytes32(userAddress!),
          MAX_FEE_PARAMETER,
          1000, // minFinalityThreshold (1000 or less for Fast Transfer)
        ],
      }),
    } as unknown as Parameters<typeof sepoliaClient.sendTransaction>[0]);

    console.log(`Burn Tx: ${burnTx}`);
    return burnTx;
  }

  async function retrieveAttestation(transactionHash: string) {
    console.log("Retrieving attestation...");
    const url = `https://iris-api-sandbox.circle.com/v2/messages/${ETHEREUM_SEPOLIA_DOMAIN}?transactionHash=${transactionHash}`;
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
    if (!avalancheClient) return;

    console.log("Minting USDC on Avalanche Fuji...");
    const mintTx = await avalancheClient.sendTransaction({
      to: AVALANCHE_FUJI_MESSAGE_TRANSMITTER,
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
    } as Parameters<typeof avalancheClient.sendTransaction>[0]);
    console.log(`Mint Tx: ${mintTx}`);
  }

  const handleNextPhase = async () => {
    switch (currentPhase) {
      case "checkChain":
        if (chainId === targetChain) {
          await handleSwitchChain(
            targetChain === sepolia.id ? avalancheFuji : sepolia
          );
          setCurrentPhase("approve");
        }
        break;
      case "approve":
        await approveTransaction();
        setCurrentPhase("burn");
        break;
      case "burn":
        const burnTx = await burnUSDC();
        // Other phase?
        const attestation = await retrieveAttestation(burnTx as string);
        console.log(attestation);

        await handleSwitchChain(
          targetChain === sepolia.id ? sepolia : avalancheFuji
        );
        await mintUSDC(attestation);
        setCurrentPhase("completed");
        break;
      //   case "retrieve":
      //     const retrieved = await simulateTransaction("Retrieval");
      //     if (retrieved) setCurrentPhase("completed");
      //     break;
    }
  };

  return (
    <button
      onClick={handleNextPhase}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    >
      {currentPhase}
    </button>
  );
};

export default AggregateAction;
