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
