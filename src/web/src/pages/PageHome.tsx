import { IotaSystemStateSummary } from "@iota/iota-sdk/client";
import { useState } from "react";
import { useAppContext } from "../app/context";
import { Btn } from "../comp/buttons";
import { IOTA_DECIMALS } from "@iota/iota-sdk/utils";
import { NetworkRadioSelector } from "../comp/selectors";
import { supportedNetworks } from "../app/config";

export const PageHome = () =>
{
    const { header, network, setNetwork, demoClient } = useAppContext();

    const [ systemState, setSystemState ] = useState<IotaSystemStateSummary | null>(null);

    const foo = async () => {
        const state = await demoClient.iotaClient.getLatestIotaSystemState();
        setSystemState(state);
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

            </div>
        </div>
    </>;
};
