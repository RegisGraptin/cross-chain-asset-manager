"use client";

import type { NextPage } from "next";
import Header from "../components/Header";
import { useAccount } from "wagmi";
import { useAllBalances } from "../hooks/user";

import { PortfolioOverview } from "../components/token/PortfolioOverview";
import MonthlyRewardWidget from "../components/widgets/MonthlyRewardWidget";
import AllocationWidget from "../components/widgets/AllocationWidget";

const Home: NextPage = () => {
  const { address: userAddress } = useAccount();

  // const { data: userBalances } = useAllBalances(userAddress);
  // console.log("User Balances:", userBalances);

  return (
    <>
      <Header />

      <div className="max-w-screen-lg mx-auto pt-10 pb-10">
        <main className="">
          <section className="grid grid-cols-2 gap-4">
            <PortfolioOverview />

            <AllocationWidget userAddress={userAddress} />
            {/* <MonthlyRewardWidget /> */}
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
