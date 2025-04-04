import { Address, erc20Abi, formatUnits } from "viem";
import { TESTNET } from "../../utils/wagmi";
import { useMemo } from "react";
import { avalancheFuji, sepolia } from "viem/chains";
import { useAccount, useBalance, useReadContracts } from "wagmi";

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
      <ul className="list-disc list-inside">
        <li>Sepolia: {sepoliaBalance?.value}</li>
        <li>Fuji: {fujiBalance?.value}</li>
      </ul>
    </div>
  );
};
