import Head from "next/head";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import moon from "../styles/imgs/moon.png";
import {
  planetContractAbi,
  planetContractAddress,
  planetPerPrice,
} from "../components/contractInfo";
import { Loading } from "../components/loading";

export default function Home() {
  const [currentProvider, setCurrentProvider] = useState<
    undefined | ethers.providers.Web3Provider
  >();
  const [currentSigner, setCurrentSigner] = useState<
    undefined | ethers.providers.JsonRpcSigner
  >();
  const [currentAddress, setCurrentAddress] = useState<undefined | string>();
  const [currentNetwork, setCurrentNetwork] = useState<undefined | string>();
  const [loading, setLoading] = useState(false);
  const connectWallet = useCallback(async () => {
    if (!currentProvider) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      (window as any).ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      (window as any).ethereum.on("accountsChanged", async () => {
        window.location.reload();
      });
      setCurrentProvider(provider);
    }
    await currentProvider?.send("eth_requestAccounts", []);
    const network = await currentProvider?.getNetwork();
    console.log(network);

    setCurrentNetwork(network?.name);
    const signer = currentProvider?.getSigner();
    setCurrentSigner(signer);
    setCurrentAddress(await signer?.getAddress());
  }, [currentProvider]);

  const switchToMumbai = useCallback(async () => {
    if ((window as any).ethereum) {
      const chainId = "0x61"; // BSC testnet
      const currentChainId = await (window as any).ethereum.request({
        method: "eth_chainId",
      });
      console.log(currentChainId, chainId);

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

      const network = await currentProvider?.getNetwork();
      setCurrentNetwork(network?.name);
      const signer = currentProvider?.getSigner();
      setCurrentSigner(signer);
      setCurrentAddress(await signer?.getAddress());
    }
  }, [currentProvider]);

  const [openseaUrl, setOpenSeaUrl] = useState<undefined | string>();
  const mint = useCallback(async () => {
    console.log("mint");

    if (!currentSigner) {
      alert("please connect wallet!");
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        planetContractAddress,
        planetContractAbi,
        currentSigner
      );
      const count = 1;
      const transaction = await contract.mint(count, {
        value: planetPerPrice.mul(count),
      });
      const res = await transaction.wait(1);
      const mintedTokenId = res.events.filter(
        (ev: any) => ev.event === "Transfer"
      )[0].args[2] as ethers.BigNumber;
      const openseaUrl = `https://testnets.opensea.io/assets/bsc-testnet/${planetContractAddress}/${mintedTokenId.toString()}`;
      setOpenSeaUrl(openseaUrl);
    } catch (e) {
      alert((e as any).message);
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [currentSigner]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  return (
    <>
      <Head>
        <title>ChainIDE showcase planetNFT</title>
        <meta name="description" content="chainIDE planet template" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="isolate bg-white h-full overflow-y-auto flex items-center justify-center">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <svg
            className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset={1} stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="absolute top-0 right-0">
          <div className="px-6 pt-6 lg:px-8">
            <div>
              <nav
                className="flex h-9 items-center justify-between"
                aria-label="Global"
              >
                <div className="flex min-w-0 flex-1 justify-end">
                  {currentAddress ? (
                    `${currentNetwork}:${currentAddress}`
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="inline-block rounded-lg px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
        <main className="w-full">
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-3 pb-5 sm:pt-10 sm:pb-10">
              <div>
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    <span className="text-gray-600">
                      ChainIDE provides this showcase for NFT development.{" "}
                      <a
                        href="https://chainide.com"
                        target="_blank"
                        className="font-semibold text-indigo-600"
                        rel="noreferrer"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        Learn more about ChainIDE.{" "}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Planet NFT
                  </h1>
                  <div className="mt-6 text-lg leading-8 text-gray-600 text-center">
                    <Image
                      src={moon}
                      alt="moon"
                      width={300}
                      className="m-auto py-[50px]"
                    />
                    <br />

                    {currentNetwork === "bnbt" ? (
                      <div>
                        To begin minting a Planet NFT, click the button below.
                      </div>
                    ) : (
                      <div>
                        To claim this NFT, please switch to{" "}
                        <button
                          onClick={switchToMumbai}
                          className="text-sky-500 background-transparent font-bold outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 underline"
                          type="button"
                        >
                          BSC Testnet
                        </button>
                        .
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <button
                      onClick={mint}
                      disabled={loading || currentNetwork !== "bnbt"}
                      className=" disabled:opacity-75 inline-flex items-center gap-x-0.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                    >
                      {loading && <Loading />}
                      Mint Now
                    </button>
                  </div>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    {openseaUrl && (
                      <p className="text-[#1e9427]">
                        mint success! check{" "}
                        <a href={openseaUrl} target="_blank" rel="noreferrer">
                          {openseaUrl}
                        </a>{" "}
                        to see details
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
