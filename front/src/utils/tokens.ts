import { Address } from "viem";

export interface Balance {
  decimals: number;
  value: bigint;
}

export interface Token {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

export const SEPOLIA_TOKEN_ASSETS: Record<string, Token> = {
  "0x68194a729c2450ad26072b3d33adacbcef39d574": {
    address: "0x68194a729c2450ad26072b3d33adacbcef39d574",
    name: "DAI",
    symbol: "DAI",
    decimals: 18,
  },
  "0x779877a7b0d9e8603169ddbd7836e478b4624789": {
    address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
    name: "LINK",
    symbol: "LINK",
    decimals: 18,
  },
  "0xf08a50178dfcde18524640ea6618a1f965821715": {
    address: "0xf08a50178dfcde18524640ea6618a1f965821715",
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  "0x16EFdA168bDe70E05CA6D349A690749d622F95e0": {
    address: "0x16EFdA168bDe70E05CA6D349A690749d622F95e0",
    name: "WBTC",
    symbol: "WBTC",
    decimals: 8,
  },
  "0x7b79995e5f793a07bc00c21412e50ecae098e7f9": {
    address: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9",
    name: "WETH",
    symbol: "WETH",
    decimals: 18,
  },
  "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0": {
    address: "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
    name: "USDT",
    symbol: "USDT",
    decimals: 6,
  },
  "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E": {
    address: "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E",
    name: "EURS",
    symbol: "EURS",
    decimals: 2,
  },
};
