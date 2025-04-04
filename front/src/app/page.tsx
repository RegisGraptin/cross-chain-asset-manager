"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import { AssetTokenSelect } from "../components/token/AssetTokenSelect";
import { TOKEN_ASSETS, USDC_TESTNET } from "../utils/tokens";
import { useAllBalances, useBalances } from "../hooks/user";
import { chainsInformation } from "../utils/wagmi";
import { arbitrum, avalancheFuji, sepolia } from "viem/chains";
import { Address, encodeFunctionData } from "viem";
import {
  addressToBytes32,
  AVALANCHE_FUJI_DOMAIN,
  AVALANCHE_FUJI_MESSAGE_TRANSMITTER,
  ETHEREUM_SEPOLIA_DOMAIN,
  ETHEREUM_SEPOLIA_TOKEN_MESSENGER,
  MAX_FEE_PARAMETER,
} from "../utils/circle";

const Home: NextPage = () => {
  const { address: userAddress, chainId } = useAccount();

  // const { data: userBalances } = useBalances(userAddress, chainId);
  const { data: userBalances } = useAllBalances(userAddress);
  console.log("User Balances:", userBalances);

  const [selectedToken, setSelectedToken] = useState<
    keyof typeof TOKEN_ASSETS | ""
  >("");

  console.log("Selected token:", selectedToken);

  const { data: sepoliaClient } = useWalletClient({ chainId: sepolia.id });
  const { data: avalancheClient } = useWalletClient({
    chainId: avalancheFuji.id,
  });

  const { chains, switchChain } = useSwitchChain();

  async function aggregateLiquidity() {
    if (!sepoliaClient) return;

    switchChain({ chainId: sepolia.id });

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

  // async function approveUSDC() {
  //   console.log("Approving USDC transfer...");

  //   writeContract({
  //     address: USDC_TESTNET[sepolia.id] as Address,
  //     abi: [
  //       {
  //         type: "function",
  //         name: "approve",
  //         stateMutability: "nonpayable",
  //         inputs: [
  //           { name: "spender", type: "address" },
  //           { name: "amount", type: "uint256" },
  //         ],
  //         outputs: [{ name: "", type: "bool" }],
  //       },
  //     ],
  //     functionName: "approve",
  //     args: [ETHEREUM_SEPOLIA_TOKEN_MESSENGER, BigInt(10_000 * 6)],
  //   });

  //   await waitForTransactionReceipt({ hash: tx1.hash });
  // }

  // async function burnUSDC() {
  //   console.log("Burning USDC on Ethereum Sepolia...");

  //   const burnTx = await sepoliaClient.sendTransaction({
  //     to: ETHEREUM_SEPOLIA_TOKEN_MESSENGER,
  //     data: encodeFunctionData({
  //       abi: [
  //         {
  //           type: "function",
  //           name: "depositForBurn",
  //           stateMutability: "nonpayable",
  //           inputs: [
  //             { name: "amount", type: "uint256" },
  //             { name: "destinationDomain", type: "uint32" },
  //             { name: "mintRecipient", type: "bytes32" },
  //             { name: "burnToken", type: "address" },
  //             { name: "destinationCaller", type: "bytes32" },
  //             { name: "maxFee", type: "uint256" },
  //             { name: "minFinalityThreshold", type: "uint32" },
  //           ],
  //           outputs: [],
  //         },
  //       ],
  //       functionName: "depositForBurn",
  //       args: [
  //         AMOUNT,
  //         AVALANCHE_FUJI_DOMAIN,
  //         DESTINATION_ADDRESS_BYTES32,
  //         ETHEREUM_SEPOLIA_USDC,
  //         DESTINATION_CALLER_BYTES32,
  //         maxFee,
  //         1000, // minFinalityThreshold (1000 or less for Fast Transfer)
  //       ],
  //     }),
  //   });
  //   console.log(`Burn Tx: ${burnTx}`);
  //   return burnTx;
  // }

  return (
    <>
      <Header />

      <div className="container mx-auto pt-20">
        <main className="p-4 bg-white rounded-lg shadow-md">
          <section className="container grid grid-cols-2 gap-4">
            <div className="w-100 mx-auto">
              <AssetTokenSelect
                tokens={Object.values(TOKEN_ASSETS)}
                selected={selectedToken}
                onChange={(value) => {
                  setSelectedToken(value);
                }}
              />

              {selectedToken && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">
                    Available on Chains:
                  </h2>
                  <ul className="list-disc list-inside">
                    {Object.entries(TOKEN_ASSETS[selectedToken].data).map(
                      ([chainId, value]) => (
                        <li key={chainId}>
                          {chainsInformation[chainId].name} -{" "}
                          {userBalances[chainId]?.[value.toLowerCase()]}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h2>Aggregate liquidity</h2>
              <div className="mt-4">
                <label
                  htmlFor="chain-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Chain:
                </label>
                <select
                  id="chain-select"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) =>
                    console.log("Selected Chain ID:", e.target.value)
                  }
                >
                  <option value="">Select a chain</option>
                  {Object.entries(chainsInformation).map(([id, chain]) => (
                    <option key={id} value={id}>
                      {chain.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => aggregateLiquidity()}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Aggregate
              </button>
            </div>

            {/* <div>
              <div className="mt-4">
                <label
                  htmlFor="user-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  User Address:
                </label>
                <input
                  type="text"
                  id="user-address"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  id="amount"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div> */}
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
