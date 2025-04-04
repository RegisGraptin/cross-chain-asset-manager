import { Address } from "viem";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from "viem/chains";

export interface Balance {
  decimals: number;
  value: bigint;
}

export interface Token {
  name: string;
  symbol: string;
}

// https://developers.circle.com/stablecoins/usdc-on-main-networks
export const USDC_MAINNET = {
  [mainnet.id]: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  [arbitrum.id]: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  [optimism.id]: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
};

export const USDC_TESTNET = {
  [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  [arbitrumSepolia.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  [optimismSepolia.id]: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
};

export const TOKEN_ASSETS = {
  USDC: {
    name: "USDC",
    symbol: "USDC",
    data: process.env.NEXT_PUBLIC_TESTNET ? USDC_TESTNET : USDC_MAINNET,
  },
};
