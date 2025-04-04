"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAccount } from "wagmi";
import { AssetTokenSelect } from "../components/token/AssetTokenSelect";
import { TOKEN_ASSETS } from "../utils/tokens";
import { useAllBalances, useBalances } from "../hooks/user";
import { chainsInformation } from "../utils/wagmi";
import { arbitrum } from "viem/chains";

const Home: NextPage = () => {
  const { address: userAddress, chainId } = useAccount();

  // const { data: userBalances } = useBalances(userAddress, chainId);
  const { data: userBalances } = useAllBalances(userAddress);
  console.log("User Balances:", userBalances);

  const [selectedToken, setSelectedToken] = useState<
    keyof typeof TOKEN_ASSETS | ""
  >("");

  const [amount, setAmount] = useState("");

  console.log("Selected token:", selectedToken);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

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
                          {chainsInformation[chainId]} -{" "}
                          {userBalances[chainId][value.toLowerCase()]}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div>
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
                  value={userAddress}
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
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
