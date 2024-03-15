/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "antd";
import { ethers } from "ethers";
import { useWalletStore } from "../stores";

import {
  planetContractAbi,
  planetContractAddress,
} from "../components/contractInfo";
import { Space } from "lucide-react";

export default function Upgrade() {
  const { address, signer, network } = useWalletStore();
  const [nfts, setNfts] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getUserNft = useCallback(async () => {
    if (!signer) {
      return;
    }

    if (network !== "bnbt") return;
    setLoading(true);
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
    setLoading(false);
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
              My Planets({nfts.length})
            </button>

            <button className="text-xl text-gray-400">
              Upgradable Planets(0)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-4">
          {loading &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2 items-center">
                <Skeleton.Image
                  active={true}
                  style={{ width: 200, height: 200 }}
                />
                <Skeleton.Input
                  active={true}
                  style={{ width: 10 }}
                  size="small"
                />
              </div>
            ))}
          {nfts.map((id: string) => (
            <div className="max-w-sm bg-white rounded" key={id}>
              <Link href={`/item/${id}`}>
                <div className="relative rounded border border-gray-200 w-full h-[200px] flex items-center justify-center p-2">
                  <img
                    className="rounded"
                    src="https://placehold.co/200x200/EEE/31343C"
                    alt=""
                  />
                </div>
              </Link>
              <div className="p-2">
                <Link href={`/item/${id}`}>
                  <h5 className="mb-2 text-center font-light tracking-tight text-[#3B3C3D]">
                    #{id}
                  </h5>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
