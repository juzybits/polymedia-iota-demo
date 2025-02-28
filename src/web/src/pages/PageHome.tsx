import { useCurrentAccount, useDisconnectWallet } from "@iota/dapp-kit";
import { IotaSystemStateSummary } from "@iota/iota-sdk/client";
import { IOTA_DECIMALS } from "@iota/iota-sdk/utils";
import { useState } from "react";
import { supportedNetworks } from "../app/config";
import { useAppContext } from "../app/context";
import { Btn } from "../comp/buttons";
import { NetworkRadioSelector } from "../comp/selectors";

export const PageHome = () =>
{
    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    const { header, network, setNetwork, openConnectModal, demoClient } = useAppContext();

    const [ systemState, setSystemState ] = useState<IotaSystemStateSummary | null>(null);
    const [ error, setError ] = useState<string | null>(null);

    const foo = async () => {
        setError(null);
        setSystemState(null);
        try {
            const state = await demoClient.iotaClient.getLatestIotaSystemState();
            setSystemState(state);
        } catch (error) {
            setError("Something went wrong (check console)");
        }
    };

    const createNft = async () => {
        if (!currAcct) {
            return;
        }
        const resp = await demoClient.createNft({
            sender: currAcct.address,
            name: "My NFT",
            imageUrl: "https://i.pinimg.com/564x/30/cc/bb/30ccbb7afbc9919f358837a59871910c.jpg",
            description: "This is a description of my NFT",
            dryRun: true,
        });
        console.log(resp);
    };

    return <>
        {header}

        <div id="page-home" className="page-regular">
            <div className="page-content">

                <div className="card compact">
                    <div className="card-title">
                        System State
                    </div>
                    <div className="card-desc">
                        <Btn onClick={foo}>Get state</Btn>
                        {error && <p className="error">{error}</p>}
                        {systemState && <>
                            <p>Epoch: {systemState.epoch}</p>
                            <p>Epoch duration: {(Number(systemState.epochDurationMs) / 1000 / 60)} minutes</p>
                            <p>Protocol version: {systemState.protocolVersion}</p>
                            <p>System state version: {systemState.systemStateVersion}</p>
                            <p>Iota total supply: {Number(BigInt(systemState.iotaTotalSupply) / BigInt(10**IOTA_DECIMALS)).toLocaleString()}</p>
                            <p>Iota treasury cap ID: {systemState.iotaTreasuryCapId}</p>

                        </>}
                    </div>
                </div>

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

            </div>
        </div>
    </>;
};
