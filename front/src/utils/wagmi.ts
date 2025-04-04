import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism } from "wagmi/chains";

export const chainsInformation = {
  [mainnet.id]: mainnet.name,
  [arbitrum.id]: arbitrum.name,
  [base.id]: base.name,
  [optimism.id]: optimism.name,
};

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, arbitrum, base, optimism],
  ssr: true,
});
