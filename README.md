
# ChainIDE Showcase PlanetNFT

## Introduction
ChainIDE Showcase PlanetNFT is an NFT (non-fungible token) project that allows users to purchase and upgrade unique digital planets. The contract includes functions for minting the NFTs, setting the sale price, and withdrawing funds or tokens. It also uses various OpenZeppelin libraries for safe ERC20 & 721 token transfers, access control, and preventing reentrancy attacks. The maximum supply of the NFTs is set upon contract creation, and the contract owner can grant or revoke admin roles for managing the contract.

## Develop

### Deploy Contracts

1. Visit [ChainIDE for Ethereum Doc](https://chainide.gitbook.io/chainide-english-1/ethereum-ide-1/1.-ethereum-ide/untitled-1-1) import this GitHub project using this [URL](https://github.com/MatrixLabsTech/chainide-showcase-planetnft-sepolia) to ChainIDE for Ethereum.
2. Switch Metamask to **Sepolia** and get some test ETH.
3. Navigate to the `contracts/Planet.sol`, open the Planet.sol smart contract in the editor panel, compile it, set the `_salePrice` (uint: wei)  and `_maxSupply` (match the number of metadata you want to upload next) for your collection, deploy to Sepolia, and get the contract address. (You can verify the contract here.)

### Run backend

1. Open Sandbox in ChainIDE.

2.  

```
   cd backend
```
3. 

```
   yarn install
```

4. 

```
   yarn build && NODE_ENV=development CONTRACT_ADDRESS=<contract_address> node dist/server.js
```

   
   Replace <contract_address> with the previously deployed contract address.
      

5. [Port forwarding](https://chainide.gitbook.io/chainide-english-1/port-forwarding) HTTP on port 3001 and get the corresponding port. (e.g., https://sandbox-3dea326a0b10459cbf8639564123d8e7-ethereum-3001.prod-sandbox.chainide.com).

### Generate metadata

1. Download `frontend/styles/ings` to the local environment.

2. Preview `html/upload.html`
3. Change BASEURI to the corresponding port of the backend.  (e.g., https://sandbox-3dea326a0b10459cbf8639564123d8e7-ethereum-3001.prod-sandbox.chainide.com).

4. Customize TOKENID, NAME, DESCRIPTION, ATTRIBUTES, and IMAGE.

   For example：

```
TOKENID: 1
NAME: Mars #1
DESCRIPTION: Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.
ATTRIBUTES: [{"trait_type": "rarity","value": "common"}]
```

````
TOKENID: 2
NAME: Earth #2
DESCRIPTION: Earth is the third planet from the Sun and the fifth-largest planet in the Solar System.
ATTRIBUTES: [{"trait_type": "rarity","value": "common"}]
````

```
TOKENID: 3
NAME: Moon #3
DESCRIPTION: The Moon is Earth's only natural satellite but not a planet. 
ATTRIBUTES: [{"trait_type": "rarity","value": "common"}]
```

5. Click "Submit" and **partially copy** the generated metadata. (e.g., https://sandbox-3dea326a0b10459cbf8639564123d8e7-ethereum-3001.prod-sandbox.chainide.com/metadata/)

###  Set variable

1. Interact with the planet contract you just deployed. Click on `setBaseURI` and paste the partially copied address from the previous step. Then click on "Submit".

2. Navigate to `frontend/config.ts` and update the `contractAddress` with your deployed wallet address that you obtained earlier. Replace `baseApi` with the corresponding port generated in **Run backend** section (e.g., https://sandbox-3dea326a0b10459cbf8639564123d8e7-ethereum-3001.prod-sandbox.chainide.com).

```typescript
  contractAddress: "0x19345E47170cbFb0ada10AB516e4dcD5A1A04BE8",
  baseApi: "http://localhost:3001",
```

3. Navigate to `frontend/components/contractinfo.ts`, set `planetPerPrice` to the value of `_salePrice` in the **Deploy Contracts** section.

```
export const planetPerPrice = BigNumber.from("1000000000");
```

### Run frontend

1. Add another Sandbox in ChainIDE.

2. 
```
   cd fronted
```

3. 

```
   yarn install
```

4. 

```
   yarn dev
```

5. [Port forwarding](https://chainide.gitbook.io/chainide-english-1/port-forwarding) HTTP on port 3000 and open the corresponding port. (e.g., https://sandbox-3dea326a0b10459cbf8639564123d8e7-ethereum-3000.prod-sandbox.chainide.com).

6. Try it out now!
