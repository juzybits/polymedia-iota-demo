import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

export const defaultNetwork = "devnet";

export const supportedNetworks = ["testnet", "devnet", "localnet"] as const;

export type SupportedNetwork = typeof supportedNetworks[number];

export const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    devnet: { url: getFullnodeUrl("devnet") },
    localnet: { url: getFullnodeUrl("localnet") },
});

export const packageIds: Record<SupportedNetwork, string> = {
    devnet: "",
    testnet: "",
    localnet: "0xd99e0e35f8814ea63570dfd50e07aba2f3a9b1fc180b83f9d99860ebfce4ac40",
};
