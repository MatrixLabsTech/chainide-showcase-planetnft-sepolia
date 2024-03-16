import { ethers } from "ethers";
import config from "../config";

export const planetPerPrice = BigNumber.from("1000000000");
export const planetContractAddress = config.contractAddress;
export const planetContractAbi = config.contractABI;
