import {
  Address,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
} from "viem";
import { arbitrumSepolia, avalancheFuji, sepolia } from "viem/chains";
import { USDC_TESTNET } from "./tokens";

// TODO:: Defined potential other chains
// developers.circle.com/stablecoins/evm-smart-contracts

// Chain-specific Parameters
https: export const CIRCLE_DOMAIN_ID: Record<number, number> = {
  [sepolia.id]: 0, // Source domain ID for Ethereum Sepolia testnet
  [avalancheFuji.id]: 1, // Destination domain ID for Avalanche Fuji testnet
};

export const DESTINATION_CALLER_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

export function addressToBytes32(address: string): `0x${string}` {
  return `0x000000000000000000000000${address.slice(2)}`;
}

export const MAX_FEE_PARAMETER = BigInt(500);

export const ETHEREUM_SEPOLIA_TOKEN_MESSENGER =
  "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa";
export const AVALANCHE_FUJI_MESSAGE_TRANSMITTER =
  "0xe737e5cebeeba77efe34d4aa090756590b1ce275";

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
  [avalancheFuji.id]: "",
};

/**
 * Map of supported chains to Message Transmitter contract addresses
 */
export const MESSAGE_TRANSMITTER_ADDRESSES: Record<number, Address> = {
  [sepolia.id]: "",
  [avalancheFuji.id]: "0xe737e5cebeeba77efe34d4aa090756590b1ce275",
};
