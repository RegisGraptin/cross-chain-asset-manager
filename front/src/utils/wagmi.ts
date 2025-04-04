import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  arbitrumSepolia,
  avalancheFuji,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "wagmi/chains";

export const MAINNET = {
  [mainnet.id]: mainnet,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
  [optimism.id]: optimism,
};

export const TESTNET = {
  [sepolia.id]: sepolia,
  [arbitrumSepolia.id]: arbitrumSepolia,
  [baseSepolia.id]: baseSepolia,
  [optimismSepolia.id]: optimismSepolia,
  [avalancheFuji.id]: avalancheFuji,
};

export const chainsInformation = process.env.NEXT_PUBLIC_TESTNET
  ? TESTNET
  : MAINNET;

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, ...Object.values(chainsInformation)],
  ssr: true,
});
