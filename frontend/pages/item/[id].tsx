"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { Modal, Tabs } from "antd";
import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import config from "../../config";
import { planetContractAddress } from "../../components/contractInfo";
import { getTokenMetadata, uploadMetadata } from "../../services";
import clsx from "clsx";

export default function ItemDetail({ metadata }: any) {
  const router = useRouter();
  const { id } = router.query;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [decoratedImage, setDecoratedImage] = useState<string>("");
  const [decorations, setDecorations] = useState<any>({
    cloud: null,
    spaceship: null,
    rocket: null,
    satellite: null,
  });

  const convertDataURLToFile = (dataURL: string) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${Date.now()}.png`, { type: mime });
  };

  const handleUpgradeMetadata = async () => {
    const formData = new FormData();
    formData.append("tokenId", id as string);
    formData.append("baseUri", config.baseApi);
    formData.append("name", metadata.name);
    formData.append("description", metadata.description);
    formData.append("image", convertDataURLToFile(decoratedImage) as File);

    metadata.attributes?.forEach((item: any) => {
      if (item.trait_type === "rarity") {
        item.value = "uncommon";
      }
    });

    formData.append("attributes", JSON.stringify(metadata.attributes));

    await uploadMetadata(formData);
    toast.success("Upgrade success");
    window.location.reload();
  };

  const drawImage = (url: string, decorations: any[]) => {
    const pixelRatio = 12;
    const canvas = document.createElement("canvas")! as HTMLCanvasElement;
    canvas.width = 200 * pixelRatio;
    canvas.height = 200 * pixelRatio;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, 200 * pixelRatio, 200 * pixelRatio);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    ctx?.scale(pixelRatio, pixelRatio);
    image.onload = () => {
      ctx?.drawImage(image, 0, 0, 200, 200);
      for (let decoration of decorations) {
        const decorationImage = new Image();
        decorationImage.crossOrigin = "anonymous";
        decorationImage.src = decoration.url;
        decorationImage.onload = () => {
          let scale = 200 / decorationImage.width;
          let newHeight = decorationImage.height * scale;
          if (decoration.type === "cloud") {
            ctx?.drawImage(decorationImage, 0, 80, 120, 120);
          }
          if (decoration.type === "spaceship") {
            ctx?.drawImage(decorationImage, 0, 0, 40, 30);
          }
          if (decoration.type === "rocket") {
            ctx?.drawImage(decorationImage, 120, 120, 40, 80);
          }
          if (decoration.type === "satellite") {
            ctx?.drawImage(decorationImage, 120, 0, 80, 40);
          }
          setDecoratedImage(ctx?.canvas.toDataURL("image/png") as string);
        };
      }
    };
  };

  const handleSelectDecoration = (type: string, id: number) => {
    const decoration = {
      type,
      id,
      url: `/imgs/${type}/${id}.svg`,
    };
    setDecorations((prev: any) => ({ ...prev, [type]: decoration }));
    // drawImage(metadata.image, Object.values({ ...decorations, [type]: decoration }));
  };

  // useEffect(() => {
  //   fetch(metadata.image)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       let file = new File([blob], `${Date.now()}.jpg`, {
  //         type: "image/jpeg",
  //       });
  //       setImageFile(file);
  //     })
  //     .catch((error) => console.error(error));
  // }, [metadata]);

  useEffect(() => {
    if (showUpgradeModal) {
      setTimeout(() => {
        drawImage(
          metadata.image,
          Object.values(decorations).filter((o) => o)
        );
      }, 100);
    }
  }, [showUpgradeModal]);

  useEffect(() => {
    drawImage(
      metadata.image,
      Object.values(decorations).filter((o) => o)
    );
    console.log(metadata.image, Object.values(decorations));
  }, [decorations]);

  return (
    <div className="pt-20 container mx-auto p-4 md:px-0 ">
      <Head>
        <title>ChainIDE showcase planetNFT</title>
        <meta name="description" content="chainIDE planet template" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <button
        className="px-4 py-2 bg-[#7F77F5]/10 rounded-md mb-4 text-[#7F77F6] inline-flex gap-2 items-center"
        onClick={() => window.location.reload()}
      >
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.7632 13.3751C18.5756 11.6147 18.693 9.70103 18.2264 7.9634C17.6899 5.95789 16.3697 4.16969 14.4553 3.08322L15.3045 1.24805L10.4762 2.51404L12.6357 7.01451L13.5242 5.09443C14.825 5.88881 15.7156 7.13342 16.0925 8.53479C16.4295 9.79727 16.3468 11.1701 15.7576 12.4511C15.0067 14.079 13.6031 15.1875 11.9958 15.6199C11.7632 15.6821 11.5269 15.7297 11.2884 15.7624L12.2851 17.8228C12.3799 17.8007 12.4739 17.7786 12.5673 17.753C14.7802 17.1631 16.7302 15.6193 17.7632 13.3751ZM7.51524 14.9859C6.19503 14.193 5.29091 12.9377 4.91042 11.5236C4.57347 10.2611 4.65681 8.88748 5.24528 7.60793C5.9962 5.9793 7.39978 4.8708 9.0071 4.4384C9.27362 4.36709 9.54501 4.31584 9.81935 4.28299L8.82548 2.21195C8.69509 2.2398 8.56468 2.26969 8.43569 2.30461C6.22347 2.89586 4.27278 4.43971 3.23901 6.68393C2.42825 8.44363 2.31064 10.3579 2.77732 12.0948L2.77874 12.1005C3.31948 14.1196 4.65536 15.9171 6.59116 17.0007L5.78821 18.7519L10.6116 17.4688L8.43716 12.9762L7.51524 14.9859Z"
            fill="#7F77F5"
          />
        </svg>
        Rrefresh
      </button>

      <div className="grid grid-cols-3 h-full gap-6">
        <div className="border border-gray-400 rounded col-span-1 flex flex-col items-center p-2 gap-4">
          <div className="flex justify-between w-full">
            <span></span>
            <div className="px-3 py-2 rounded-md bg-[#F6F6F6] text-[#3B3C3D] capitalize">
              {metadata.name}
            </div>
            <div
              className="bg-[#F1F6FD] p-2 rounded-md cursor-pointer"
              onClick={() => {
                window.open(
                  `https://testnets.opensea.io/assets/bsc-testnet/${planetContractAddress}/${id}`
                );
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_3011_11688)">
                  <path
                    d="M13.104 0.130227C5.92801 0.0782268 0.0780132 5.92823 0.130013 13.1042C0.182013 20.0982 5.90201 25.7922 12.896 25.8702C20.098 25.9222 25.948 20.0722 25.87 12.8962C25.818 5.90223 20.098 0.182227 13.104 0.130227Z"
                    fill="#2081E2"
                  />
                  <path
                    d="M9.25598 6.73438C10.062 7.74838 10.53 9.02237 10.53 10.4264C10.53 11.6224 10.166 12.7404 9.56798 13.6764H5.25198L9.25598 6.73438Z"
                    fill="white"
                  />
                  <path
                    d="M22.438 15.2102C22.438 15.2622 22.412 15.3142 22.36 15.3402C22.074 15.4702 21.112 15.9122 20.696 16.4842C19.656 17.9142 18.876 20.2022 17.108 20.2022H9.69799C7.07199 20.2022 4.88799 18.1222 4.91399 15.3662C4.91399 15.2882 4.96599 15.2362 5.04399 15.2362H8.52799C8.65799 15.2362 8.73599 15.3402 8.73599 15.4442V16.1202C8.73599 16.4842 9.02199 16.7702 9.38599 16.7702H12.038V15.2362H10.218C11.258 13.9102 11.882 12.2462 11.882 10.4262C11.882 8.39816 11.102 6.55216 9.82799 5.17416C10.608 5.25216 11.336 5.40816 12.012 5.61616V5.17416C12.012 4.73216 12.376 4.36816 12.818 4.36816C13.26 4.36816 13.624 4.73216 13.624 5.17416V6.21416C16.094 7.35816 17.732 9.28216 17.732 11.4662C17.732 12.7402 17.186 13.9362 16.224 14.9242C16.042 15.1062 15.782 15.2102 15.522 15.2102H13.65V16.7442H15.99C16.484 16.7442 17.394 15.7822 17.836 15.2102C17.836 15.2102 17.862 15.1842 17.914 15.1582C17.966 15.1322 22.23 14.1702 22.23 14.1702C22.308 14.1442 22.412 14.2222 22.412 14.3002L22.438 15.2102Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3011_11688">
                    <rect width="26" height="26" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <img
            src={metadata.image}
            crossOrigin="anonymous"
            alt=""
            className="w-[70%]"
          />

          <div className="p-2 bg-[#F6F6F6] rounded min-h-[120px]">
            <h5 className="font-bold text-[#3B3C3D] flex gap-1 items-center">
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.4519 4.36381C13.4519 4.58162 13.3074 4.7281 13.0876 4.7281H9.45242C9.23461 4.7281 9.08812 4.58354 9.08812 4.36381V3.63715C9.08812 3.41935 9.23268 3.27286 9.45242 3.27286H13.0876C13.3054 3.27286 13.4519 3.41742 13.4519 3.63715V4.36381ZM13.4519 7.27238C13.4519 7.49018 13.3074 7.63667 13.0876 7.63667H9.45242C9.23461 7.63667 9.08812 7.49211 9.08812 7.27238V6.54572C9.08812 6.32791 9.23268 6.18142 9.45242 6.18142H13.0876C13.3054 6.18142 13.4519 6.32598 13.4519 6.54572V7.27238ZM13.4519 10.1809C13.4519 10.3987 13.3074 10.5452 13.0876 10.5452H3.63529C3.41748 10.5452 3.27099 10.4007 3.27099 10.1809V9.45428C3.27099 9.23648 3.41555 9.08999 3.63529 9.08999H13.0876C13.3054 9.08999 13.4519 9.23455 13.4519 9.45428V10.1809ZM11.9967 13.0895C11.9967 13.3073 11.8521 13.4538 11.6324 13.4538H3.63336C3.41555 13.4538 3.26906 13.3092 3.26906 13.0895V12.3628C3.26906 12.145 3.41363 11.9986 3.63336 11.9986H11.6324C11.8502 11.9986 11.9967 12.1431 11.9967 12.3628V13.0895ZM3.27099 3.63522C3.27099 3.41742 3.41555 3.27093 3.63529 3.27093H7.27051C7.48832 3.27093 7.6348 3.41549 7.6348 3.63522V7.27045C7.6348 7.48825 7.49024 7.63474 7.27051 7.63474H3.63529C3.41748 7.63474 3.27099 7.49018 3.27099 7.27045V3.63522ZM14.9053 0H1.81767C1.01777 0 0.362427 0.655343 0.362427 1.45525V14.5448C0.362427 15.3447 1.01777 16 1.81767 16H14.9072C15.7071 16 16.3624 15.3447 16.3624 14.5448V1.45525C16.3605 0.655343 15.7052 0 14.9053 0Z"
                  fill="#3B3C3D"
                />
              </svg>
              Description
            </h5>
            <p className="font-light text-sm text-[#3B3C3D]">
              {metadata?.description}
            </p>
          </div>
        </div>
        <div className="grid grid-rows-2 h-full gap-4 col-span-2">
          <div className="border border-gray-400 rounded p-2">
            <h5 className="font-bold text-[#3B3C3D] flex gap-1 items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="1" fill="#3B3C3D" />
                <path
                  d="M8.38133 9.116H9.688V11.9265H8.38133V13.945H7.61867V11.9265H6.31733V9.1215H7.624V3.11H7.67733V3.055H8.38133V9.116ZM6.408 5.0405H5.09067V3H4.32267V5.0405H3V7.8785H4.32267V14H5.096V7.8785H6.41333V5.0405H6.408ZM11.6827 5.0405V3H10.9147V5.0405H9.59733V7.8785H10.9147V14H11.6827V7.8785H13V5.0405H11.6827Z"
                  fill="white"
                />
              </svg>
              Properties
            </h5>

            {metadata.attributes?.find(
              (item: any) =>
                item.trait_type === "rarity" && item.value === "common"
            ) && (
              <div className="flex items-center justify-center gap-4 flex-col">
                <div className="rounded-lg bg-[#F6F6F6] text-[#3B3C3D] capitalize inline-flex flex-col px-6 py-3 items-center gap-1">
                  <span className="text-[#818588]">Rarity</span>
                  <span className="font-bold">Common</span>
                </div>
                <button
                  className="text-white bg-gradient-to-b from-[#7F77F5] to-[#4840C7] px-10 py-2 rounded-lg"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  Upgrade
                </button>
              </div>
            )}

            {metadata.attributes?.find(
              (item: any) =>
                item.trait_type === "rarity" && item.value === "uncommon"
            ) && (
              <div className="h-[300px] flex items-center justify-center">
                <div className="rounded-lg bg-[#F6F6F6] text-[#3B3C3D] capitalize inline-flex flex-col px-6 py-3 items-center gap-1">
                  <span className="text-[#818588]">Rarity</span>
                  <span className="font-bold">Uncommon</span>
                </div>
              </div>
            )}
          </div>
          <div className="border border-gray-400 rounded p-2">
            <h5 className="font-bold text-[#3B3C3D] flex gap-1 items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="16" height="16" rx="1" fill="#3B3C3D" />
                <path
                  d="M14 7.52287C14.0006 7.6109 13.9725 7.69652 13.9203 7.76571C13.8682 7.83489 13.795 7.88354 13.7129 7.90368C13.6308 7.92382 13.5446 7.91426 13.4683 7.87656C13.3921 7.83886 13.3304 7.77526 13.2933 7.69618H13.29L12.2212 5.46621L10.2369 12.7148H10.2305C10.2095 12.7962 10.1634 12.8682 10.0994 12.9197C10.0355 12.9712 9.95706 12.9994 9.87626 13C9.80206 12.9998 9.72956 12.9767 9.66797 12.9335C9.60637 12.8904 9.55844 12.8291 9.53024 12.7574L7.25769 6.99785L5.35177 11.9711C5.32485 12.0426 5.27821 12.1043 5.21773 12.1482C5.15726 12.1921 5.08567 12.2163 5.01201 12.2178C4.93835 12.2193 4.86593 12.1979 4.8039 12.1564C4.74186 12.115 4.693 12.0552 4.66349 11.9848L4.66086 11.9785L3.51297 9.28338L2.72571 11.1957C2.70785 11.2451 2.68057 11.2903 2.64552 11.3285C2.61047 11.3667 2.56837 11.397 2.52176 11.4177C2.47515 11.4384 2.42501 11.4491 2.37435 11.449C2.3237 11.4489 2.27358 11.4381 2.22703 11.4173C2.18048 11.3964 2.13846 11.366 2.10351 11.3277C2.06856 11.2894 2.04141 11.2442 2.02369 11.1946C2.00597 11.1451 1.99805 11.0924 2.00041 11.0395C2.00277 10.9867 2.01536 10.935 2.03742 10.8874L3.16207 8.15118C3.19105 8.08168 3.23876 8.02246 3.29938 7.98073C3.36 7.93899 3.43094 7.91653 3.50356 7.91607C3.57619 7.91562 3.64738 7.93719 3.70848 7.97816C3.76958 8.01913 3.81796 8.07774 3.84774 8.14687L3.85036 8.15313L4.98589 10.8205L6.90567 5.81283C6.93366 5.74116 6.98139 5.67975 7.04283 5.63639C7.10427 5.59303 7.17665 5.56966 7.25081 5.56925C7.32498 5.56883 7.3976 5.59138 7.45948 5.63404C7.52136 5.6767 7.56973 5.73756 7.59846 5.80892L9.81028 11.4187L11.7631 4.2855H11.7694C11.7886 4.20965 11.8295 4.14176 11.8868 4.09101C11.9441 4.04026 12.015 4.00908 12.0898 4.0017C12.1646 3.99432 12.2398 4.01109 12.3052 4.04974C12.3706 4.08839 12.4231 4.14706 12.4555 4.21782H12.4588L13.9584 7.3476H13.955C13.9833 7.40142 13.9987 7.46153 14 7.52287Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
              Item Activity
            </h5>
            <div className="bg-[#F6F6F6] rounded-md p-2 mt-2">
              <table className="table-auto border-0 w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-[#818588] font-light">
                      Event
                    </th>
                    <th className="px-4 py-2 text-[#818588] font-light">
                      From
                    </th>
                    <th className="px-4 py-2 text-[#818588] font-light">To</th>
                    <th className="px-4 py-2 text-[#818588] font-light">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 text-center">John Doe</td>
                    <td className="px-4 py-2 text-center">30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-center">Jane Doe</td>
                    <td className="px-4 py-2 text-center">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        width={900}
        destroyOnClose
      >
        <div className="flex">
          <div className="w-1/3">
            <h5 className="text-center font-bold">Preview</h5>

            <div className="flex items-center justify-center px-4 py-16 flex-col gap-12">
              <img
                src={decoratedImage || metadata.image}
                alt=""
                crossOrigin="anonymous"
              />
              <div className="flex flex-col gap-4 items-center font-light">
                <button
                  className="text-white bg-gradient-to-b from-[#7F77F5] to-[#4840C7] px-10 py-2 rounded-lg"
                  onClick={handleUpgradeMetadata}
                >
                  Upgrade
                </button>
                <span>Can only be changed once </span>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <h5 className="text-center font-bold">Items</h5>

            <div className="bg-[#f6f6f6] rounded-lg p-4 mt-8">
              <Tabs
                defaultActiveKey="1"
                tabBarGutter={40}
                items={[
                  {
                    key: "1",
                    label: "Cloud",
                    children: (
                      <div className="flex gap-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-[120px] h-[120px] bg-[#EFEFF0] rounded-md flex items-center justify-center cursor-pointer hover:shadow-md hover:shadow-[#625ADD] transition-shadow",
                              {
                                "border-2 border-[#625ADD]":
                                  decorations.cloud?.id === i + 1,
                              }
                            )}
                            onClick={() =>
                              handleSelectDecoration("cloud", i + 1)
                            }
                          >
                            <div className="w-[100px] h-[100px] rounded-full bg-[#C3C2C5]">
                              <img
                                src={`/imgs/cloud/${i + 1}.svg`}
                                className="h-full"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "2",
                    label: "Spaceship",
                    children: (
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-[120px] h-[120px] bg-[#EFEFF0] rounded-md flex items-center justify-center cursor-pointer hover:shadow-md hover:shadow-[#625ADD] transition-shadow",
                              {
                                "border-2 border-[#625ADD]":
                                  decorations.spaceship?.id === i + 1,
                              }
                            )}
                            onClick={() =>
                              handleSelectDecoration("spaceship", i + 1)
                            }
                          >
                            <div className="w-[100px] h-[100px] rounded-full bg-[#C3C2C5]">
                              <img
                                src={`/imgs/spaceship/${i + 1}.svg`}
                                className="h-[20px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "3",
                    label: "Rocket",
                    children: (
                      <div className="flex gap-2">
                        {[...Array(2)].map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-[120px] h-[120px] bg-[#EFEFF0] rounded-md flex items-center justify-center cursor-pointer hover:shadow-md hover:shadow-[#625ADD] transition-shadow",
                              {
                                "border-2 border-[#625ADD]":
                                  decorations.rocket?.id === i + 1,
                              }
                            )}
                            onClick={() =>
                              handleSelectDecoration("rocket", i + 1)
                            }
                          >
                            <div className="w-[100px] h-[100px] rounded-full bg-[#C3C2C5]">
                              <img
                                src={`/imgs/rocket/${i + 1}.svg`}
                                className="h-[40px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "4",
                    label: "Satellite",
                    children: (
                      <div className="flex gap-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={clsx(
                              "w-[120px] h-[120px] bg-[#EFEFF0] rounded-md flex items-center justify-center cursor-pointer hover:shadow-md hover:shadow-[#625ADD] transition-shadow",
                              {
                                "border-2 border-[#625ADD]":
                                  decorations.satellite?.id === i + 1,
                              }
                            )}
                            onClick={() =>
                              handleSelectDecoration("satellite", i + 1)
                            }
                          >
                            <div className="w-[100px] h-[100px] rounded-full bg-[#C3C2C5]">
                              <img
                                src={`/imgs/satellite/${i + 1}.svg`}
                                className="h-[40px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const data = await getTokenMetadata(id);
  return {
    props: {
      metadata: data,
    }, // will be passed to the page component as props
  };
}
