import Head from "next/head";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import Image from "next/image";
import { message } from "antd";
import { useWalletStore } from "../stores";

import moon from "../styles/imgs/moon.png";
import {
  planetContractAbi,
  planetContractAddress,
  planetPerPrice,
} from "../components/contractInfo";
import { Loading } from "../components/loading";
import toast from "react-hot-toast";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const { address, signer, network } = useWalletStore();

  const [openseaUrl, setOpenSeaUrl] = useState<undefined | string>();

  const mint = useCallback(async () => {
    console.log("mint");

    if (!signer) {
      alert("please connect wallet!");
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        planetContractAddress,
        planetContractAbi,
        signer
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
      message.success(
        <div>
          mint success! check{" "}
          <a
            className="font-medium text-blue-600 hover:underline"
            href={openseaUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            opensea
          </a>{" "}
          to see details
        </div>
      );
    } catch (e) {
      message.error(
        <div className="whitespace-pre-wrap truncate w-full">
          {(e as any).message}
        </div>
      );
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [signer]);

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
                  </div>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <button
                      onClick={mint}
                      disabled={loading || network !== "sepolia"}
                      className="disabled:opacity-75 cursor-pointer inline-flex items-center gap-x-0.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                    >
                      {loading && <Loading />}
                      Mint Now
                    </button>
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
