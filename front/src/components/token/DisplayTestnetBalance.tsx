import Image from "next/image";

import { Address } from "viem";
import { avalancheFuji, sepolia } from "viem/chains";
import { useAccount, useBalance } from "wagmi";
import { formatBalance } from "../../utils/tokens";

export const TOKENS = [
  {
    chain: sepolia,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    symbol: "USDC",
    decimals: 6,
    logo: "/images/chains/ethereum.svg",
  },
  {
    chain: avalancheFuji,
    address: "0x5425890298aed601595a70ab815c96711a31bc65",
    symbol: "USDC",
    decimals: 6,
    logo: "/images/chains/avalanche.svg",
  },
];

export const DisplayTestnetBalance = ({ token }: { token: any }) => {
  const { address: userAddress } = useAccount();

  const balances = TOKENS.map(({ chain, address }) =>
    useBalance({
      address: userAddress,
      token: address as Address,
      chainId: chain.id,
    })
  );

  if (!token) {
    return null;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Available on Chains:</h2>
      {TOKENS.map(({ chain, symbol, logo }, index) => {
        const { data: balance } = balances[index];
        return (
          <div
            key={chain.id}
            className="flex items-center gap-4 p-3 rounded-lg transition-colors text-left"
          >
            <div className="flex-shrink-0 relative">
              <Image
                className="w-10 h-10 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={`/images/tokens/usdc.svg`}
                alt={`${token.name} logo`}
                width={40}
                height={40}
                aria-hidden="true"
              />
              <Image
                className="w-4 h-4 absolute -right-1 -bottom-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={logo}
                alt={`${chain.name} logo`}
                width={16}
                height={16}
                aria-hidden="true"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-semibold truncate">{chain.name}</h2>
                {symbol && (
                  <span className="text-sm text-gray-500">{symbol}</span>
                )}
              </div>
              <div className="group/tooltip relative inline-block">
                <p className="text-sm text-gray-600 truncate">
                  Available: {formatBalance(balance?.value, 6)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
