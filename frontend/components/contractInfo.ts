import { ethers } from "ethers";
import config from "../config";

export const planetPerPrice = ethers.utils.parseEther("0.000000001");
export const planetContractAddress = config.contractAddress;
export const planetContractAbi = config.contractABI;
