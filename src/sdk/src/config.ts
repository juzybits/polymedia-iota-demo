export const NETWORK_NAMES = ["mainnet", "testnet", "devnet", "localnet"] as const;

export type NetworkName = (typeof NETWORK_NAMES)[number];

export type NetworkConfig = {
    pkgId: string;
};

export const NETWORK_CONFIG: Record<NetworkName, NetworkConfig> = {
    mainnet: {
        pkgId: "",
    },
    testnet: {
        pkgId: "",
    },
    devnet: {
        pkgId: "",
    },
    localnet: {
        pkgId: "",
    },
};

export function getNetworkConfig(network: NetworkName): NetworkConfig {
    return NETWORK_CONFIG[network];
}
