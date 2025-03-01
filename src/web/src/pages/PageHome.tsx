import { useCurrentAccount, useDisconnectWallet } from "@iota/dapp-kit";
import { IotaSystemStateSummary } from "@iota/iota-sdk/client";
import { IOTA_DECIMALS } from "@iota/iota-sdk/utils";
import React, { useState } from "react";

import { supportedNetworks } from "../app/config";
import { useAppContext } from "../app/context";
import { Btn } from "../comp/buttons";
import { Header } from "../comp/header";
import { NetworkRadioSelector } from "../comp/selectors";

export const PageHome = () =>
{
    return <>
        <Header />
        <div id="page-home" className="page-regular">
            <div className="page-content">
                <CardSystemState />
                <CardNetwork />
                <CardCreateNft />
            </div>
        </div>
    </>;
};

const CardSystemState = () =>
{
    const { demoClient } = useAppContext();

    const [ state, setState ] = useState<IotaSystemStateSummary | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const fetchSystemState = async () => {
        setError(null);
        setState(null);
        try {
            const state = await demoClient.iotaClient.getLatestIotaSystemState();
            setState(state);
        } catch (error) {
            setError("Something went wrong (check console)");
        }
    };

    return (
        <div className="card compact">
            <div className="card-title">
                System State
            </div>
            <div className="card-desc">
                <Btn onClick={fetchSystemState}>
                    Get state
                </Btn>
                {error && <p className="error">{error}</p>}
                {state && <>
                    <p>Epoch: {state.epoch}</p>
                    <p>Epoch duration: {(Number(state.epochDurationMs) / 1000 / 60)} minutes</p>
                    <p>Protocol version: {state.protocolVersion}</p>
                    <p>System state version: {state.systemStateVersion}</p>
                    <p>Iota total supply: {Number(BigInt(state.iotaTotalSupply) / BigInt(10**IOTA_DECIMALS)).toLocaleString()}</p>
                </>}
            </div>
        </div>
    );
};

const CardNetwork = () =>
{
    const { network, setNetwork } = useAppContext();
    return (
        <div className="card compact">
            <div className="card-title">
                Network
            </div>
            <div className="card-desc">
                <NetworkRadioSelector
                    selectedNetwork={network}
                    supportedNetworks={supportedNetworks}
                    onSwitch={setNetwork}
                />
            </div>
        </div>
    );
};

const CardCreateNft = () =>
{
    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    const { demoClient, openConnectModal } = useAppContext();

    const createNft = async () => {
        if (!currAcct) {
            return;
        }
        const resp = await demoClient.createNft({
            sender: currAcct.address,
            name: "My NFT",
            imageUrl: "https://i.pinimg.com/564x/30/cc/bb/30ccbb7afbc9919f358837a59871910c.jpg",
            description: "The NFT description",
        });
        console.log(resp);
    };

    return (
        <div className="card compact">
            <div className="card-title">
                Create NFT
            </div>
            {!currAcct
                ? <Btn onClick={() => Promise.resolve(openConnectModal())}>
                    Connect
                </Btn>
                : <>
                    <div>Connected: <span className="address">{currAcct.address}</span></div>
                    <Btn onClick={() => Promise.resolve(disconnect())}>
                        DISCONNECT
                    </Btn>
                </>
            }
            {currAcct && <>
                <Btn onClick={createNft}>
                    Create NFT
                </Btn>
            </>}
        </div>
    );
};
