import { Address } from "viem";
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  lineaSepolia,
  sepolia,
} from "viem/chains";
import { USDC_TESTNET } from "./tokens";

// TODO:: Defined potential other chains
// developers.circle.com/stablecoins/evm-smart-contracts

// Chain-specific Parameters
export const CIRCLE_DOMAIN_ID: Record<number, number> = {
  [sepolia.id]: 0,
  [avalancheFuji.id]: 1,
  [baseSepolia.id]: 6,
  [lineaSepolia.id]: 11,
};

export const DESTINATION_CALLER_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function addressToBytes32(address: string): `0x${string}` {
  return `0x000000000000000000000000${address.slice(2)}`;
}

export const MAX_FEE_PARAMETER = BigInt(500);

export const USDC_ADDRESS: Record<number, Address> = {
  [sepolia.id]: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  [avalancheFuji.id]: "0x5425890298aed601595a70ab815c96711a31bc65",
  [arbitrumSepolia.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
};

/**
 * Map of supported chains to Token Messenger contract addresses
 */
export const TOKEN_MESSENGER_ADDRESSES: Record<number, Address> = {
  [sepolia.id]: "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa",
  [avalancheFuji.id]: "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa",
  [baseSepolia.id]: "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa",
  [lineaSepolia.id]: "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa",
};

/**
 * Map of supported chains to Message Transmitter contract addresses
 */
export const MESSAGE_TRANSMITTER_ADDRESSES: Record<number, Address> = {
  [sepolia.id]: "0xe737e5cebeeba77efe34d4aa090756590b1ce275",
  [avalancheFuji.id]: "0xe737e5cebeeba77efe34d4aa090756590b1ce275",
  [baseSepolia.id]: "0xe737e5cebeeba77efe34d4aa090756590b1ce275",
  [lineaSepolia.id]: "0xe737e5cebeeba77efe34d4aa090756590b1ce275",
};
