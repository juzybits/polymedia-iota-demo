# IOTA Demo App

A simple end-to-end IOTA app showcasing how to wire everything together.

## Project Structure

- [src/iota/](src/iota/) - Simple NFT contract.
- [src/sdk/](src/sdk/) - TypeScript SDK to interact with the contract.
- [src/web/](src/web/) - React web app with wallet integration.

## Key Files

### Contract
- [src/iota/sources/nft.move](src/iota/sources/nft.move) - The single module in the contract.

### SDK
- [src/sdk/src/demo-client.ts](src/sdk/src/demo-client.ts) - Client class to interact with the contract.

### App
- [src/web/src/app/config.ts](src/web/src/app/config.ts) - App config. Update `packageIds` if you redeploy the contract.
- [src/web/src/app/App.tsx](src/web/src/app/App.tsx) - The app itself. Read from top to bottom to see how it gets bootstrapped.
- [src/web/src/pages/PageHome.tsx](src/web/src/pages/PageHome.tsx) - Simple UI that reads and writes to the chain.

## Local Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the project: `pnpm dev`
