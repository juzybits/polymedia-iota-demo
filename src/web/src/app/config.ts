import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

export const defaultNetwork = "devnet";

export const supportedNetworks = ["testnet", "devnet", "localnet"] as const;

export type SupportedNetwork = typeof supportedNetworks[number];

export const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl("localnet") },
    devnet: { url: getFullnodeUrl("devnet") },
    testnet: { url: getFullnodeUrl("testnet") },
});
