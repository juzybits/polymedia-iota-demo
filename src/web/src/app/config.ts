// app config
// make sure to update the packageIds if you redeploy the contract

import { createNetworkConfig } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";

export const packageIds: Record<SupportedNetwork, string> = {
    testnet: "0x7d770a34c0cac85262108045fa323db26f3cf635cfd18db9812546674f5789a9",
    devnet: "",
    localnet: "0x29832adee5ab3673f71db04bfc3abad36d3b9a9ce24595ae709e771a8aa60de9",
};

export const defaultNetwork = "localnet";

export const supportedNetworks = ["testnet", "devnet", "localnet"] as const;

export type SupportedNetwork = typeof supportedNetworks[number];

export const { networkConfig } = createNetworkConfig({
    testnet: { url: getFullnodeUrl("testnet") },
    devnet: { url: getFullnodeUrl("devnet") },
    localnet: { url: getFullnodeUrl("localnet") },
});
