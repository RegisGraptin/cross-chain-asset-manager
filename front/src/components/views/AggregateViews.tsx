"use client";

import { useState } from "react";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { AssetTokenSelect } from "../../components/token/AssetTokenSelect";
import { TOKEN_ASSETS, USDC_TESTNET } from "../../utils/tokens";

import { avalancheFuji, sepolia } from "viem/chains";
import { Address, encodeFunctionData } from "viem";
import {
  addressToBytes32,
  AVALANCHE_FUJI_DOMAIN,
  AVALANCHE_FUJI_MESSAGE_TRANSMITTER,
  ETHEREUM_SEPOLIA_DOMAIN,
  ETHEREUM_SEPOLIA_TOKEN_MESSENGER,
  MAX_FEE_PARAMETER,
} from "../../utils/circle";
import { DisplayTestnetBalance } from "../../components/token/DisplayTestnetBalance";
import { ChainSelect } from "../chain/ChainSelect";
import AggregateAction from "../actions/AggregateAction";

const AggregateView = () => {
  const { address: userAddress, chainId } = useAccount();

  const [selectedToken, setSelectedToken] = useState<
    keyof typeof TOKEN_ASSETS | ""
  >("");

  const [selectedChain, setSelectedChain] = useState<Number>();

  console.log("Selected token:", selectedToken);

  const { data: sepoliaClient } = useWalletClient({ chainId: sepolia.id });
  const { data: avalancheClient } = useWalletClient({
    chainId: avalancheFuji.id,
  });

  const { chains, switchChain } = useSwitchChain();

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

  return (
    <>
      <div className="container mx-auto pt-20">
        <main className="p-4 bg-white rounded-lg shadow-md">
          <section className="container grid grid-cols-2 gap-4">
            <div className="w-100 mx-auto">
              <h2 className="text-xl font-semibold mb-2">Assets</h2>
              <AssetTokenSelect
                tokens={Object.values(TOKEN_ASSETS)}
                selected={selectedToken}
                onChange={(value) => {
                  setSelectedToken(value);
                }}
              />

              {/* Select token => address */}

              <DisplayTestnetBalance token={TOKEN_ASSETS[selectedToken]} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Target Chain</h2>
              <ChainSelect
                selected={selectedChain}
                onChange={(value) => {
                  setSelectedChain(value);
                }}
              />
            </div>

            <AggregateAction targetChain={selectedChain} />
          </section>
        </main>
      </div>
    </>
  );
};

export default AggregateView;
