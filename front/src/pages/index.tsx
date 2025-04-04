import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Header from "../components/Header";

// Update the getTokenData function to include USDC, WETH, WBTC
const getTokenData = () => {
  return [
    { token: "USDC", chains: ["Ethereum", "Polygon"], amount: 1000 },
    { token: "WETH", chains: ["Ethereum", "Avalanche"], amount: 500 },
    { token: "WBTC", chains: ["Bitcoin", "Ethereum"], amount: 300 },
  ];
};

const Home: NextPage = () => {
  const [selectedToken, setSelectedToken] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [amount, setAmount] = useState("");
  const tokenData = getTokenData();

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  // https://1inch-vercel-proxy-eight.vercel.app/portfolio/portfolio/v4/overview/erc20/current_value?addresses={address}&chain_id=1

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
                  onChange={handleAddressChange}
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
