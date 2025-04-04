"use client";

import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAccount } from "wagmi";

// Update the getTokenData function to include USDC, WETH, WBTC
const getTokenData = () => {
  return [
    { token: "USDC", chains: ["Ethereum", "Polygon"], amount: 1000 },
    { token: "WETH", chains: ["Ethereum", "Avalanche"], amount: 500 },
    { token: "WBTC", chains: ["Bitcoin", "Ethereum"], amount: 300 },
  ];
};

const Home: NextPage = () => {
  const { address: userAddress } = useAccount();

  async function getCurrentValue(walletAddress: string, chainId: string) {
    const response = await fetch("/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, chainId }),
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  useEffect(() => {
    if (userAddress) {
      getCurrentValue(userAddress, "1");
    }
  }, [userAddress]);

  const [selectedToken, setSelectedToken] = useState("");

  const [amount, setAmount] = useState("");
  const tokenData = getTokenData();

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  return (
    <>
      <Header />

      <div className="container mx-auto">
        <main className="mx-auto w-full max-w-md p-4 bg-white rounded-lg shadow-md">
          <section className="container mx-auto grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="token-select"
                className="block text-sm font-medium text-gray-700"
              >
                Select a token:
              </label>
              <select
                id="token-select"
                value={selectedToken}
                onChange={handleTokenChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">--Please choose a token--</option>
                {tokenData.map((token) => (
                  <option key={token.token} value={token.token}>
                    {token.token}
                  </option>
                ))}
              </select>

              {selectedToken && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">
                    Available on Chains:
                  </h2>
                  <ul className="list-disc list-inside">
                    {tokenData
                      .find((token) => token.token === selectedToken)
                      ?.chains.map((chain) => <li key={chain}>{chain}</li>)}
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
