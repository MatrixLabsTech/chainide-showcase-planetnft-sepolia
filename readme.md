# ChainIDE showcase planetnft

This is a project for ChainIDE showcase.

### deploy contracts

open chainIDE, deploy `contracts/Planet.sol` to BSC testnet.

### copy deployed contract address to `frontend/components/contractInfo.ts`

```typescript
export const planetPerPrice = ethers.utils.parseEther("0.000000001");
export const planetContractAddress =
  "0x27edEB4b1eeFE11e3Cd98Dd8f2156528689E6191";
```

### develop

#### 1. Build & start backend (NFT Metadata Storage)

```
cd backend
yarn install
yarn build
yarn start
```

URL: http://localhost:3001

#### 2. Build & start frontend (NFT Mint Page)

```
cd frontend
yarn install
yarn build
yarn start
```

URL: http://localhost:3000
