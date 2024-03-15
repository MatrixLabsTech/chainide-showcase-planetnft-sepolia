/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "antd";
import { ethers } from "ethers";
import clsx from "clsx";
import { useWalletStore } from "../stores";
import { batchGetTokenMetadata } from "../services";

import {
  planetContractAbi,
  planetContractAddress,
} from "../components/contractInfo";

export default function Upgrade() {
  const { address, signer, network } = useWalletStore();
  const [nfts, setNfts] = useState<any>([]);
  const [nftMetadata, setNftMetadata] = useState<any>([]);
  const [currentTab, setCurrentTab] = useState<"my" | "upgradable">("my");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab: "my" | "upgradable") => {
    setCurrentTab(tab);
  };

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

  const getNftMetadata = useCallback(async () => {
    if (nfts.length === 0) return;
    const res = await batchGetTokenMetadata(
      nfts.map((id: string) => parseInt(id))
    );
    setNftMetadata(res);
  }, [nfts]);

  const filterUpgradable = useCallback(() => {
    return nftMetadata.filter((o: any) => {
      return o.attributes.find(
        (attr: any) => attr.trait_type === "rarity" && attr.value === "common"
      );
    });
  }, [nftMetadata]);

  useEffect(() => {
    getNftMetadata();
  }, [getNftMetadata]);

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
            <button
              className={clsx("border-r pr-2 text-xl border-gray-300", {
                "text-gray-400": currentTab !== "my",
                "text-black": currentTab === "my",
              })}
              onClick={() => handleTabChange("my")}
            >
              My Planets({nfts.length})
            </button>

            <button
              className={clsx("text-xl ", {
                "text-gray-400": currentTab !== "upgradable",
                "text-black": currentTab === "upgradable",
              })}
              onClick={() => handleTabChange("upgradable")}
            >
              Upgradable Planets({filterUpgradable().length})
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
          {currentTab === "my" &&
            nfts.map((id: string) => {
              const metadata = nftMetadata.find(
                (item: any) => item.tokenId === id
              );
              return (
                <div className="max-w-sm bg-white rounded" key={id}>
                  <Link href={`/item/${id}`}>
                    <div className="relative rounded border border-gray-200 w-full h-[200px] flex items-center justify-center p-2">
                      <img
                        className="rounded h-full"
                        src={
                          metadata?.image ||
                          "https://placehold.co/200x200/EEE/31343C?text=PlanetNFT"
                        }
                        crossOrigin="anonymous"
                        alt=""
                      />

                      <div className="absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 hover:opacity-100 hover:bg-[#5A52D7] hover:bg-opacity-[83%] transition">
                        <button className="rounded px-4 py-1 text-sm bg-white">
                          Check
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-2">
                    <Link href={`/item/${id}`}>
                      <h5 className="mb-2 text-center font-light tracking-tight text-[#3B3C3D] capitalize">
                        {metadata?.name || `#${id}`}
                      </h5>
                    </Link>
                  </div>
                </div>
              );
            })}
          {currentTab === "upgradable" &&
            filterUpgradable().map((item: any) => {
              return (
                <div className="max-w-sm bg-white rounded" key={item.tokenId}>
                  <Link href={`/item/${item.tokenId}`}>
                    <div className="relative rounded border border-gray-200 w-full h-[200px] flex items-center justify-center p-2">
                      <img
                        className="rounded h-full"
                        src={
                          item.image ||
                          "https://placehold.co/200x200/EEE/31343C?text=PlanetNFT"
                        }
                        crossOrigin="anonymous"
                        alt=""
                      />

                      <div className="absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 hover:opacity-100 hover:bg-[#5A52D7] hover:bg-opacity-[83%] transition">
                        <button className="rounded px-4 py-1 text-sm bg-white">
                          Check
                        </button>
                      </div>
                    </div>
                  </Link>
                  <div className="p-2">
                    <Link href={`/item/${item.tokenId}`}>
                      <h5 className="mb-2 text-center font-light tracking-tight text-[#3B3C3D] capitalize">
                        {item.name || `#${item.tokenId}`}
                      </h5>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
