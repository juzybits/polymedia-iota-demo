import { DevInspectTransactionBlockParams, IotaClient, IotaTransactionBlockResponse, IotaTransactionBlockResponseOptions } from "@iota/iota-sdk/client";
import { SignatureWithBytes } from "@iota/iota-sdk/cryptography";
import { Transaction } from "@iota/iota-sdk/transactions";

import { SignTx } from "./lib.js";

export class DemoClient
{
    constructor(
        public readonly iotaClient: IotaClient,
        public readonly signTx: SignTx,
        public readonly pkgId: string,
    ) {}

    // === package interactions ===

    public async createNft(arg: {
        sender: string;
        name: string;
        imageUrl: string;
        description: string;
        dryRun?: boolean;
    }): Promise<IotaTransactionBlockResponse>
    {
        const tx = new Transaction();
        const [nft] = tx.moveCall({
            target: `${this.pkgId}::nft::new`,
            typeArguments: [],
            arguments: [
                tx.pure.string(arg.name),
                tx.pure.string(arg.imageUrl),
                tx.pure.string(arg.description),
            ],
        });
        tx.moveCall({
            target: "0x2::transfer::public_transfer",
            typeArguments: [ `${this.pkgId}::nft::Nft` ],
            arguments: [ nft, tx.pure.address(arg.sender) ],
        });
        const resp = await this.signAndExecuteTx({
            tx,
            sender: arg.sender,
            dryRun: arg.dryRun,
        });
        return resp;
    }

    // === transaction helpers ===

    public async executeTx({
        signedTx,
        txRespOptions,
        dryRun = false,
        sender,
    }: {
        signedTx: SignatureWithBytes;
        txRespOptions?: IotaTransactionBlockResponseOptions;
        dryRun?: boolean;
        sender?: string;
    }): Promise<IotaTransactionBlockResponse>
    {
        if (dryRun) {
            return this.dryRunTx({ tx: signedTx.bytes, sender });
        }
        const resp = await this.iotaClient.executeTransactionBlock({
            transactionBlock: signedTx.bytes,
            signature: signedTx.signature,
            options: txRespOptions,
        });
        return resp;
    }

    public async signAndExecuteTx({
        tx,
        txRespOptions,
        dryRun = false,
        sender,
    }: {
        tx: Transaction;
        txRespOptions?: IotaTransactionBlockResponseOptions;
        dryRun?: boolean;
        sender?: string;
    }): Promise<IotaTransactionBlockResponse>
    {
        if (dryRun) {
            return await this.dryRunTx({ tx, sender });
        }

        const signedTx = await this.signTx(tx);
        const resp = await this.executeTx({ signedTx, txRespOptions, sender });

        if (resp.effects && resp.effects.status.status !== "success") {
            throw new Error(`Transaction failed: ${JSON.stringify(resp, null, 2)}`);
        }

        return resp;
    }

    public async dryRunTx({
        tx,
        sender = "0x7777777777777777777777777777777777777777777777777777777777777777",
    }: {
        tx: DevInspectTransactionBlockParams["transactionBlock"];
        sender?: string;
    }): Promise<IotaTransactionBlockResponse>
    {
        const resp = await this.iotaClient.devInspectTransactionBlock({
            sender,
            transactionBlock: tx,
        });
        if (resp.effects && resp.effects.status.status !== "success") {
            throw new Error(`Transaction failed: ${JSON.stringify(resp, null, 2)}`);
        }
        return { digest: "", ...resp };
    }
}
