import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWalletStore } from "../stores";

import {
  planetContractAbi,
  planetContractAddress,
} from "../components/contractInfo";

export default function Upgrade() {
  const { address, signer, network } = useWalletStore();
  const [nfts, setNfts] = useState<any>([]);

  const getUserNft = useCallback(async () => {
    if (!signer) {
      return;
    }

    if (network !== "bnbt") return;
    const contract = new ethers.Contract(
      planetContractAddress,
      planetContractAbi,
      signer
    );
    const balance = await contract.balanceOf(address);
    const tokenIds = [];
    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      tokenIds.push(tokenId);
    }

    setNfts(tokenIds.map((id) => id.toString()));
  }, [address, network, signer]);

  useEffect(() => {
    getUserNft();
  }, [getUserNft]);

  return (
    <>
      <Head>
        <title>ChainIDE showcase planetNFT</title>
        <meta name="description" content="chainIDE planet template" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pt-20 container mx-auto p-4 md:px-0">
        <div className="">
          <div className="flex gap-2">
            <button className="border-r border-gray-300 pr-2 text-xl">
              My Planets(2)
            </button>

            <button className="text-xl text-gray-400">
              Upgradable Planets(0)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {nfts.map((id: string) => (
            <div
              className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              key={id}
            >
              <Link href={`/item/${id}`}>
                <Image
                  className="rounded-t-lg"
                  src="https://flowbite.com/docs/images/blog/image-1.jpg"
                  alt=""
                  width={400}
                  height={400}
                />
              </Link>
              <div className="p-5">
                <Link href={`/item/${id}`}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    #{id}
                  </h5>
                </Link>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
