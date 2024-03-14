import { create } from "zustand";
import { ethers } from "ethers";

type WalletStore = {
  provider: ethers.providers.Web3Provider | null | undefined;
  signer: any;
  address: string;
  network: string;

  setProvider: (
    provider: ethers.providers.Web3Provider | null | undefined
  ) => void;
  setNetwork: (network: string | undefined) => void;
  setSigner: (signer: any) => void;
  setAddress: (address: string | undefined) => void;
  reset: () => void;
};

export const useWalletStore = create<WalletStore>((set) => ({
  provider: null,
  signer: null,
  address: "",
  network: "",

  setProvider: (provider) => set({ provider }),
  setNetwork: (network) => set({ network }),
  setSigner: (signer) => set({ signer }),
  setAddress: (address) => set({ address }),
  reset: () => set({ signer: null, address: "" }),
}));
