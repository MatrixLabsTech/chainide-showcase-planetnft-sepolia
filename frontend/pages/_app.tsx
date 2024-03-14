import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { Toaster } from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { useWalletStore } from "../stores";
import { formatHexAddress } from "../utils";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const {
    address,
    setAddress,
    signer,
    setSigner,
    network,
    setNetwork,
    provider,
    setProvider,
    reset,
  } = useWalletStore();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleDisconnect = useCallback(() => {
    reset();
    localStorage.removeItem("accountAddress");
  }, [reset]);

  const connectWallet = useCallback(async () => {
    const _provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    if (!provider) {
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      (window as any).ethereum.on("accountsChanged", async () => {
        window.location.reload();
      });
      setProvider(_provider);
    }
    await _provider?.send("eth_requestAccounts", []);
    const network = await _provider?.getNetwork();
    const signer = _provider?.getSigner();
    const address = await signer?.getAddress();
    setSigner(signer);
    setAddress(address || "");
    setNetwork(network?.name);
    console.log(address, 111);
    localStorage.setItem("accountAddress", address || "");
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
    if (localStorage.getItem("accountAddress")) {
      connectWallet();
    }
  }, [connectWallet]);
  return (
    <>
      <nav className="bg-white fixed w-full left-0 right-1 z-20 top-0 start-0 bg-transparent">
        <div className="container flex flex-wrap items-center justify-between mx-auto p-4 md:px-0">
          <div
            className={clsx("inline-flex gap-1 items-center cursor-pointer", {
              invisible: router.pathname === "/",
            })}
            onClick={() => router.back()}
          >
            <svg
              width="8"
              height="12"
              viewBox="0 0 8 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.89863 0L5 6L8 12L0 5.96174L7.89863 0Z" fill="black" />
            </svg>
            Back
          </div>
          <div className="relative flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
            {router.pathname === "/" && address && (
              <Link href="/upgrade">
                <button
                  type="button"
                  className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none border border-gray-200 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                >
                  Upgrade
                </button>
              </Link>
            )}
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
              onClick={async () => {
                await connectWallet();
                await switchToMumbai();
                window.location.reload();
              }}
              onMouseOver={() => setShowDropdown(true)}
            >
              {" "}
              {address && network === "bnbt"
                ? formatHexAddress(address)
                : "Connect Wallet"}
            </button>

            <div
              className={clsx(
                "flex-col absolute right-0 top-10 bg-white border w-[120px] rounded p-2 cursor-pointer",
                {
                  flex: showDropdown && localStorage.getItem("accountAddress"),
                  hidden:
                    !showDropdown || !localStorage.getItem("accountAddress"),
                }
              )}
              onMouseOver={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onClick={handleDisconnect}
            >
              Disconnect
            </div>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
