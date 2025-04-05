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
import { avalancheFuji, sepolia } from "viem/chains";
import { PortfolioOverview } from "../components/token/PortfolioOverview";
import MonthlyRewardWidget from "../components/widgets/MonthlyRewardWidget";
import AllocationWidget from "../components/widgets/AllocationWidget";

const Home: NextPage = () => {
  const { address: userAddress, chainId } = useAccount();

  // const { data: userBalances } = useBalances(userAddress, chainId);
  const { data: userBalances } = useAllBalances(userAddress);
  console.log("User Balances:", userBalances);

  const [selectedToken, setSelectedToken] = useState<
    keyof typeof TOKEN_ASSETS | ""
  >("");

  return (
    <>
      <Header />

      <div className="max-w-screen-lg mx-auto pt-10 pb-10">
        <main className="">
          <section className="grid grid-cols-2 gap-4">
            <PortfolioOverview />

            <AllocationWidget userAddress={userAddress} />
            <MonthlyRewardWidget />
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
