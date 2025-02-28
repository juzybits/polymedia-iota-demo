import { IotaClient } from "@iota/iota-sdk/client";

import { SignTx } from "./lib.js";

export class DemoClient
{
    public readonly iotaClient: IotaClient;
    public readonly signTx: SignTx;

    constructor({
        iotaClient,
        signTx,
    }: {
        iotaClient: IotaClient;
        signTx: SignTx;
    }) {
        this.iotaClient = iotaClient;
        this.signTx = signTx;
    }
}
