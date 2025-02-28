import { createContext, ReactNode, useContext } from "react";

import { DemoClient } from "@polymedia/iota-demo-sdk";

import { SupportedNetwork } from "./config";

export type AppContextType = {
    network: SupportedNetwork; setNetwork: (network: SupportedNetwork) => void;
    openConnectModal: () => void;
    header: ReactNode;
    demoClient: DemoClient;
};

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return context;
};
