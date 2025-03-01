// some examples for how to read and write from the chain

import { useCurrentAccount, useDisconnectWallet } from "@iota/dapp-kit";
import { IotaSystemStateSummary } from "@iota/iota-sdk/client";
import { IOTA_DECIMALS } from "@iota/iota-sdk/utils";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { makeIotaExplorerUrl } from "@polymedia/iota-demo-sdk";

import { Nft } from "../../../sdk/dist/esm/demo-structs";
import { supportedNetworks } from "../app/config";
import { useAppContext } from "../app/context";
import { Btn } from "../comp/buttons";
import { Header } from "../comp/header";
import { InputText } from "../comp/inputs";
import { LinkExternal } from "../comp/links";
import { NetworkRadioSelector } from "../comp/selectors";

export const PageHome = () =>
{
    const [ lastCreateTx, setLastCreateTx ] = useState<string | null>(null);

    return <>
        <Header />
        <div id="page-home" className="page-regular">
            <div className="page-content">
                <CardSystemState />
                <CardNetwork />
                <CardCreateNft onSuccess={(digest: string) => setLastCreateTx(digest)} />
                <CardNftList lastCreateTx={lastCreateTx} />
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

const CardCreateNft = ({
    onSuccess,
}: {
    onSuccess: (digest: string) => void;
}) =>
{
    // === state ===

    const currAcct = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();

    const { demoClient, openConnectModal } = useAppContext();

    const [ name, setName ] = useState("Demo NTF");
    const [ imageUrl, setImageUrl ] = useState("https://i.pinimg.com/564x/30/cc/bb/30ccbb7afbc9919f358837a59871910c.jpg");

    // === functions ===

    const createNft = async () => {
        if (!currAcct) {
            return;
        }
        const resp = await demoClient.createNft({
            sender: currAcct.address,
            name,
            imageUrl,
            description: "The NFT description",
        });
        console.log(resp);
        toast.success("Success");
        onSuccess(resp.digest);
    };

    // === html ===

    return (
        <div className="card compact">
            <div className="card-title">
                Create NFT
            </div>
            {currAcct ?
                <div className="form">
                        <InputText
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputText
                            label="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Btn onClick={createNft}>
                            Create NFT
                        </Btn>
                        <Btn onClick={() => Promise.resolve(disconnect())} className="red">
                            DISCONNECT
                        </Btn>
                </div>
            : <Btn onClick={() => Promise.resolve(openConnectModal())}>
                Connect
            </Btn>}
        </div>
    );
};

const CardNftList = ({
    lastCreateTx,
}: {
    lastCreateTx: string | null;
}) =>
{
    // === state ===

    const currAcct = useCurrentAccount();

    const { demoClient, network } = useAppContext();
    const [ nfts, setNfts ] = useState<Nft[]>([]);

    // === functions ===

    useEffect(() => {
        fetchNfts();
    }, [ demoClient, currAcct, lastCreateTx ]);

    const fetchNfts = async () => {
        if (!currAcct) {
            setNfts([]);
            return;
        }
        lastCreateTx && await demoClient.iotaClient.waitForTransaction({
            digest: lastCreateTx,
            pollInterval: 150,
        });
        const nfts = await demoClient.fetchOwnedNfts(currAcct.address);
        setNfts(nfts);
    };
    // === html ===

    if (!currAcct) {
        return null;
    }

    return (
        <div className="page-section">
            <div className="section-title center-text center-element">
                Your NFTs
            </div>

            {nfts.map((nft) => (
                <div className="card compact" key={nft.id}>
                    <div className="item">
                        <div className="card-title">
                            <h3>{nft.name}</h3>
                        </div>
                        <div className="item-img">
                            <LinkExternal href={makeIotaExplorerUrl(network, "object", nft.id)}>
                                <img src={nft.imageUrl} alt={nft.name} />
                            </LinkExternal>
                        </div>
                    </div>
                </div>
            ))}

            {nfts.length === 0 &&
            <div className="card compact">
                <div className="card-desc center-text">
                    No NFTs found in your wallet
                </div>
            </div>}

        </div>
    );
};
