"use client";

import Image from "next/image";
import { useState } from "react";
import { AssetTokenSelect } from "../../components/token/AssetTokenSelect";
import { TOKEN_ASSETS } from "../../utils/tokens";

import { avalancheFuji, sepolia } from "viem/chains";

import {
  DisplayTestnetBalance,
  TOKENS,
} from "../../components/token/DisplayTestnetBalance";
import { ChainSelect } from "../chain/ChainSelect";
import AggregateAction from "../actions/AggregateAction";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { TimelineWorkflow } from "../widgets/TimelineWorkflow";

const AggregateView = () => {
  const [selectedToken, setSelectedToken] = useState<
    keyof typeof TOKEN_ASSETS | ""
  >("");

  const [originChain, setOriginChain] = useState<number>();
  const [targetChain, setTargetChain] = useState<number>();
  const [maxValue, setMaxValue] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currentPhase, setCurrentPhase] = useState<string>("");

  const { address: userAddress } = useAccount();

  const balances = TOKENS.map(({ chain, address }) =>
    useBalance({
      address: userAddress,
      token: address as Address,
      chainId: chain.id,
    })
  );

  return (
    <>
      <div className="container mx-auto pt-20">
        <main className="p-4 bg-white rounded-lg shadow-md min-h-64">
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

            {selectedToken && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Target Chain</h2>
                <ChainSelect
                  selected={targetChain}
                  onChange={(value) => {
                    setTargetChain(value);
                    if (value === sepolia.id) {
                      setOriginChain(avalancheFuji.id);
                    }
                    if (value === avalancheFuji.id) {
                      setOriginChain(sepolia.id);
                    }
                    const id = value === sepolia.id ? 1 : 0;
                    setAmount(
                      formatUnits(
                        balances[id].data?.value || BigInt(0),
                        6
                      ).toString()
                    );
                    setMaxValue(balances[id].data?.value.toString() || "0");
                  }}
                />

                {/* Amount selection */}
                <div className="pt-2 flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Amount</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Available</span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatUnits(maxValue, 6)}
                    </span>
                    <button
                      onClick={() => setAmount(formatUnits(maxValue, 6))}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 transition-colors">
                  <input
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-transparent text-xl font-medium text-gray-900 focus:outline-none"
                  />
                  <div className="flex items-center space-x-2 mr-2">
                    <Image
                      src={`/images/tokens/usdc.svg`}
                      alt={`USDC icon`}
                      className="h-6 w-6"
                      width={24}
                      height={24}
                    />
                    <span className="font-medium text-gray-700">USDC</span>
                  </div>
                </div>
                <div className="pt-5">
                  <AggregateAction
                    originChain={originChain}
                    targetChain={targetChain}
                    bridgeAmount={parseUnits(amount, 6)}
                    currentPhase={currentPhase}
                    setCurrentPhase={setCurrentPhase}
                  />
                </div>
              </div>
            )}

            {selectedToken && (
              <div className="col-span-2">
                <TimelineWorkflow currentPhase={currentPhase} />
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AggregateView;
