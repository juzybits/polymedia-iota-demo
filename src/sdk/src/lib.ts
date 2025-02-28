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

/**
 * Abbreviate a hex address for display purposes (lossy). Default format is '0x1234…5678',
 * given an address like '0x1234000000000000000000000000000000000000000000000000000000005678'.
 */
export function shortenAddress(
   text: string|null|undefined, start=4, end=4, separator="…", prefix="0x",
): string {
   if (!text) return "";

   const addressRegex = /0[xX][a-fA-F0-9]{1,}/g;

   return text.replace(addressRegex, (match) => {
       // check if the address is too short to be abbreviated
       if (match.length - prefix.length <= start + end) {
           return match;
       }
       // otherwise, abbreviate the address
       return prefix + match.slice(2, 2 + start) + separator + match.slice(-end);
   });
}

export type IotaExplorerItem = "address" | "object" | "package" | "tx" | "coin";

/**
 * Build a URL for the IOTA explorer.
 */
export const makeIotaExplorerUrl = (
    network: string,
    kind: IotaExplorerItem,
    address: string,
): string =>
{
    const baseUrl = "https://explorer.rebased.iota.org";

    let path: string;
    if (kind === "tx") {
        path = "txblock";
    } else if (kind === "package") {
        path = "object";
    } else if (kind === "coin") {
        path = "object";
        address = address.split("::")[0];
    } else {
        path = kind;
    }

    let url = `${baseUrl}/${path}/${address}`;
    if (network !== "mainnet") {
        const networkLabel = network === "localnet" ? "http://127.0.0.1:9000" : network;
        url += `?network=${networkLabel}`;
    }
    return url;
};
