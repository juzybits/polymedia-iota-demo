import { SignatureWithBytes } from "@iota/iota-sdk/cryptography";
import { Transaction } from "@iota/iota-sdk/transactions";

/**
 * A function that can sign a `Transaction`.
 *
 * For apps that use `@iota/dapp-kit` to sign with an wallet:
    ```
    const { mutateAsync: walletSignTx } = useSignTransaction();
    const signTx: SignTx = async (tx) => {
        return walletSignTx({ transaction: tx });
    };
    ```
 * For code that has direct access to the private key:
    ```
    const secretKey = "iotaprivkey1...";
    const signer = pairFromSecretKey(secretKey)
    const signTx: SignTx = async (tx) => {
        tx.setSenderIfNotSet(signer.toIotaAddress());
        const txBytes = await tx.build({ client: iotaClient });
        return signer.signTransaction(txBytes);
    };
    ```
 */
    export type SignTx = (tx: Transaction) => Promise<SignatureWithBytes>;
