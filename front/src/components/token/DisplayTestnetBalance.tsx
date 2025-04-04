import Image from "next/image";

import { Address, erc20Abi, formatUnits } from "viem";
import { TESTNET } from "../../utils/wagmi";
import { useMemo } from "react";
import { avalancheFuji, sepolia } from "viem/chains";
import { useAccount, useBalance, useReadContracts } from "wagmi";
import { formatBalance } from "../../utils/tokens";

const TOKENS = [
  {
    chain: sepolia,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    symbol: "USDC",
    decimals: 6,
  },
  {
    chain: avalancheFuji,
    address: "0x5425890298aed601595a70ab815c96711a31bc65",
    symbol: "USDC",
    decimals: 6,
  },
];

export const DisplayTestnetBalance = ({ token }: { token: any }) => {
  const { address: userAddress } = useAccount();

  const { data: sepoliaBalance } = useBalance({
    address: userAddress,
    token: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    chainId: sepolia.id,
  });

  const { data: fujiBalance } = useBalance({
    address: userAddress,
    token: "0x5425890298aed601595a70ab815c96711a31bc65",
    chainId: avalancheFuji.id,
  });

  if (!token) {
    return;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Available on Chains:</h2>

      <div className="flex items-center gap-4 p-3 rounded-lg transition-colors text-left">
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
            src={`/images/chains/ethereum.svg`}
            alt={`${token.name} logo`}
            width={16}
            height={16}
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold truncate">Sepolia</h2>
            {token.symbol && (
              <span className="text-sm text-gray-500">{token.symbol}</span>
            )}
          </div>
          {/* Available Balance */}
          {
            <div className="group/tooltip relative inline-block">
              <p className="text-sm text-gray-600 truncate">
                Available: {formatBalance(sepoliaBalance?.value, 6)}
              </p>
            </div>
          }
        </div>
      </div>
      <div className="flex items-center gap-4 p-3 rounded-lg transition-colors text-left">
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
            src={`/images/chains/avalanche.svg`}
            alt={`${token.name} logo`}
            width={16}
            height={16}
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold truncate">Fuji</h2>
            {token.symbol && (
              <span className="text-sm text-gray-500">{token.symbol}</span>
            )}
          </div>
          {/* Available Balance */}
          {
            <div className="group/tooltip relative inline-block">
              <p className="text-sm text-gray-600 truncate">
                Available: {formatBalance(fujiBalance?.value, 6)}
              </p>
            </div>
          }
        </div>
      </div>
    </div>
  );
};
