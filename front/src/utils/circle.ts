import {
  Address,
  createWalletClient,
  custom,
  encodeFunctionData,
  http,
} from "viem";
import { arbitrumSepolia, avalancheFuji, sepolia } from "viem/chains";
import { USDC_TESTNET } from "./tokens";

// Chain-specific Parameters
export const ETHEREUM_SEPOLIA_DOMAIN = 0; // Source domain ID for Ethereum Sepolia testnet
export const AVALANCHE_FUJI_DOMAIN = 1; // Destination domain ID for Avalanche Fuji testnet

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

/**
 * Map of supported chains to Token Messenger contract addresses
 */
export const CHAIN_IDS_TO_TOKEN_MESSENGER_ADDRESSES = {
  [sepolia.id]: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
  [avalancheFuji.id]: "0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0",
  [arbitrumSepolia.id]: "0x9f3b8679c73c2fef8b59b4f3444d4e156fb70aa5",
};

/**
 * Map of supported chains to Message Transmitter contract addresses
 */
export const CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES = {
  [sepolia.id]: "0x7865fafc2db2093669d92c0f33aeef291086befd",
  [avalancheFuji.id]: "0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79",
  [arbitrumSepolia.id]: "0xacf1ceef35caac005e15888ddb8a3515c41b4872",
};
