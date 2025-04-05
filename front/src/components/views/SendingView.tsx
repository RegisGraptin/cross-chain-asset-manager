"use client";

import { getAddress, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { AssetTokenSelect } from "../token/AssetTokenSelect";
import { useState } from "react";
import { ALL_TOKEN_ASSETS, TOKEN_ASSETS } from "../../utils/tokens";
import { ChainSelect } from "../chain/ChainSelect";

const SendingView = () => {
  //   const sdk = new SDK({
  //     url: process.env.NEXT_PUBLIC_INCH_PROXY!,
  //   });

  //   const params = {
  //     srcChainId: NetworkEnum.ETHEREUM,
  //     dstChainId: NetworkEnum.GNOSIS,
  //     srcTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  //     dstTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //     amount: "1000000000000000000000",
  //   };

  //   const quote = sdk.getQuote(params);
  //   console.log("Quote:", quote);

  const { address: userAddress } = useAccount();

  async function swapTransfer() {
    const srcChainId = 1;
    const dstChainId = 137;
    const srcTokenAddress = getAddress(
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ).toString(); // ETH - USDC
    const dstTokenAddress = getAddress(
      "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359"
    ).toString(); // POL - UDDC
    const amount = parseUnits("1000", 6).toString();

    const res = await fetch("/api/relayer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        srcChainId,
        dstChainId,
        srcTokenAddress,
        dstTokenAddress,
        amount,
        userAddress,
      }),
    });

    if (!res.ok) throw new Error(`Failed to fetch data for chain`);
    const result = await res.json();
  }

  const [originToken, setOriginToken] = useState<
    keyof typeof ALL_TOKEN_ASSETS | ""
  >("");
  const [targetToken, setTargetToken] = useState<
    keyof typeof ALL_TOKEN_ASSETS | ""
  >("");

  const [originChain, setOriginChain] = useState();
  const [targetChain, setTargetChain] = useState();

  return (
    <>
      <div className="container mx-auto pt-20">
        <main className="p-4 bg-white rounded-lg shadow-md min-h-64">
          <section className="container grid grid-cols-2 gap-4">
            <div className="w-100 mx-auto">
              <h2 className="text-xl font-semibold mb-2">Origin Chain</h2>
              <div className="pb-5">
                <ChainSelect
                  selected={originChain}
                  onChange={(value) => {
                    setOriginChain(value);
                  }}
                />
              </div>
              <AssetTokenSelect
                tokens={Object.values(ALL_TOKEN_ASSETS)}
                selected={originToken}
                onChange={(value) => {
                  setOriginToken(value);
                }}
              />
            </div>
            <div className="w-100 mx-auto">
              <h2 className="text-xl font-semibold mb-2">Target Chain</h2>
              <div className="pb-5">
                <ChainSelect
                  selected={targetChain}
                  onChange={(value) => {
                    setTargetChain(value);
                  }}
                />
              </div>
              <AssetTokenSelect
                tokens={Object.values(ALL_TOKEN_ASSETS)}
                selected={targetToken}
                onChange={(value) => {
                  setTargetToken(value);
                }}
              />
            </div>
            <div></div>
            <div className="mx-auto">
              <button
                className="w-full sm:w-auto px-8 py-2 bg-transparent border-2 border-gray-300 hover:border-blue-600 rounded-xl text-lg font-semibold text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
                onClick={() => swapTransfer()}
              >
                Swap
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default SendingView;
