import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";
import { useCallback, useEffect } from "react";
import { useWalletStore } from "../stores";

export default function App({ Component, pageProps }: AppProps) {
  const {
    address,
    setAddress,
    signer,
    setSigner,
    network,
    setNetwork,
    provider,
    setProvider,
  } = useWalletStore();

  const connectWallet = useCallback(async () => {
    if (!provider) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      (window as any).ethereum.on("accountsChanged", async () => {
        window.location.reload();
      });
      setProvider(provider);
    }
    await provider?.send("eth_requestAccounts", []);
    const network = await provider?.getNetwork();

    setNetwork(network?.name);
    const signer = provider?.getSigner();
    const address = await signer?.getAddress();
    setSigner(signer);
    setAddress(address || "");
  }, [provider, setAddress, setNetwork, setProvider, setSigner]);

  const switchToMumbai = useCallback(async () => {
    if ((window as any).ethereum) {
      const chainId = "0x61"; // BSC testnet
      const currentChainId = await (window as any).ethereum.request({
        method: "eth_chainId",
      });

      if (currentChainId !== chainId) {
        try {
          // metamask new version bug, can not switch -> https://github.com/MetaMask/metamask-extension/issues/18509
          // should delete netwowork.then add
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }],
          });
        } catch (err) {
          // This error code indicates that the chain has not been added to MetaMask
          if ((err as any).code === 4902) {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "bnbt",
                  chainId: chainId,
                  nativeCurrency: {
                    name: "BSC Testnet",
                    decimals: 18,
                    symbol: "BNB",
                  },
                  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                },
              ],
            });
          }
        }
      }

      const network = await provider?.getNetwork();
      setNetwork(network?.name);
      const signer = provider?.getSigner();
      const address = await signer?.getAddress();
      setSigner(signer);
      setAddress(address || "");
    }
  }, [provider, setAddress, setNetwork, setSigner]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);
  return (
    <>
      <nav className="bg-white fixed w-full left-0 right-1 z-20 top-0 start-0 border-b border-gray-200 ">
        <div className="container flex flex-wrap items-center justify-between mx-auto p-4 md:px-0">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Planet NFT
            </span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
            <Link href="/upgrade">
              <button
                type="button"
                className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none border border-gray-200 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Upgrade
              </button>
            </Link>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              onClick={async () => {
                await connectWallet();
                await switchToMumbai();
              }}
            >
              {address && network === "bnbt" ? "Connected" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
