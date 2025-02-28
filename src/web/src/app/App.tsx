import { ConnectModal, IotaClientProvider, useIotaClient, useSignTransaction, WalletProvider } from "@iota/dapp-kit";
import "@iota/dapp-kit/dist/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";

import { DemoClient } from "@polymedia/iota-demo-sdk";

import { defaultNetwork, networkConfig, packageIds, SupportedNetwork } from "./config";
import { AppContext, AppContextType, useAppContext } from "./context";
import { PageHome } from "../pages/PageHome";
import { PageNotFound } from "../pages/PageNotFound";
import "../styles/App.less";

// ==== router ====

export const AppRouter = () =>
(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<AppIotaProviders />} >
                <Route index element={<PageHome />} />
                <Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
);

// ==== iota providers ====

const queryClient = new QueryClient();
const AppIotaProviders = () =>
{
    const [ network, setNetwork ] = useState<SupportedNetwork>(defaultNetwork);
    return (
        <QueryClientProvider client={queryClient}>
            <IotaClientProvider networks={networkConfig} network={network}>
                <WalletProvider autoConnect={true}>
                    <App network={network} setNetwork={setNetwork} />
                </WalletProvider>
            </IotaClientProvider>
        </QueryClientProvider>
    );
};

// ==== app ====

const App = ({
    network,
    setNetwork,
}: {
    network: SupportedNetwork;
    setNetwork: (network: SupportedNetwork) => void;
}) =>
{
    // === state ===

    const [ showConnectModal, setShowConnectModal ] = useState(false);

    const iotaClient = useIotaClient();
    const { mutateAsync: walletSignTx } = useSignTransaction();

    const demoClient = useMemo(() => {
        return new DemoClient(
            iotaClient,
            (transaction) => walletSignTx({ transaction }),
            packageIds[network],
        );
    }, [iotaClient, walletSignTx, network]);

    const appContext: AppContextType = {
        network, setNetwork,
        openConnectModal: () => { setShowConnectModal(true); },
        header: <Header />,
        demoClient,
    };

    // === html ===

    return (
    <AppContext.Provider value={appContext}>
        <div id="layout">
            <Outlet /> {/* Loads a Page*.tsx */}
            <ConnectModal
                trigger={<></>}
                open={showConnectModal}
                onOpenChange={isOpen => { setShowConnectModal(isOpen); }}
            />
            <Toaster position="top-center" containerStyle={{ marginTop: 23 }} />
        </div>
    </AppContext.Provider>
    );
};

const Header = () =>
{
    const { network } = useAppContext();
    return (
    <header>
        <div className="header-item">
            <Link to="/">
                IOTA DEMO
                <span className="header-network-label">{network}</span>
            </Link>
        </div>
    </header>);
};
