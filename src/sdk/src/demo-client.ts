import { IotaClient } from "@iota/iota-sdk/client";

import { SignTx } from "./lib.js";

export class DemoClient
{
    constructor(
        public readonly iotaClient: IotaClient,
        public readonly signTx: SignTx,
        public readonly pkgId: string,
    ) {}
}
