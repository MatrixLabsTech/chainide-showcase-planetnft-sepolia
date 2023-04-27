# ChainIDE Showcase PlanetNFT

### Introduction
ChainIDE Showcase PlanetNFT is an NFT (non-fungible token) project that allows users to purchase and own unique digital planets. The contract includes functions for minting the NFTs, setting the sale price, and withdrawing funds or tokens. It also uses various OpenZeppelin libraries for safe ERC20 token transfers, access control, and preventing reentrancy attacks. The maximum supply of the NFTs is set upon contract creation, and the contract owner can grant or revoke admin roles for managing the contract.

> NOTE: This is an incomplete tutorial, mainly based on the demo video.

### Deploy Contracts
To deploy the contracts, follow these steps:

1. Visit [ChainIDE](https://chainide.com/) and import this GitHub project using this [url](https://github.com/MatrixLabsTech/chainide-showcase-planetnft-bsc.git) to ChainIDE.
2. Navigate to the `contracts/Planet.sol`, open the Planet.sol smart contract in the editor panel, compile it, set the `_salePrice` and `_maxSupply` for your collection, deploy to BSC testnet, and get the contract address.

###  Develop
To develop the project, follow these steps:

### 1. Navigate to the `frontend/components/contractInfo.ts` and update the `planetContractAddress` with your deployed wallet address that you got earlier. 

```typescript
export const planetPerPrice = ethers.utils.parseEther("0.000000001");
export const planetContractAddress =
  "0x27edEB4b1eeFE11e3Cd98Dd8f2156528689E6191";
```

### 2. Build & start the backend (NFT Metadata Storage)
```
cd backend
yarn install
yarn build
yarn start

```
URL: http://localhost:3001

### 3. Build & start frontend (NFT Mint Page)
```
cd frontend
yarn install
yarn build
yarn start
```
URL: http://localhost:3000
