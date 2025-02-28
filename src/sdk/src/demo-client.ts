import { DevInspectTransactionBlockParams, IotaClient, IotaTransactionBlockResponse } from "@iota/iota-sdk/client";
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

    public async createNft(arg: {
        sender: string;
        name: string;
        imageUrl: string;
        description: string;
        dryRun?: boolean;
    })
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
            arguments: [
                nft,
                tx.pure.address(arg.sender),
            ],
        });
        const resp = await this.signAndExecuteTx({
            tx,
            sender: arg.sender,
            dryRun: arg.dryRun,
        });
        return resp;
    }

    // === transactions ===

    public async executeTx({
        signedTx,
        dryRun = false,
        sender,
    }: {
        signedTx: SignatureWithBytes;
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
        });
        return resp;
    }

    public async signAndExecuteTx({
        tx,
        dryRun = false,
        sender,
    }: {
        tx: Transaction;
        dryRun?: boolean;
        sender?: string;
    }): Promise<IotaTransactionBlockResponse>
    {
        if (dryRun) {
            return await this.dryRunTx({ tx, sender });
        }

        const signedTx = await this.signTx(tx);
        const resp = await this.executeTx({ signedTx, sender });

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
