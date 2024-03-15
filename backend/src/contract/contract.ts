import abi from '@/config/abi.json';
import { CONTRACT_ADDRESS } from '@config';
import provider from '@provider/bscProvider';
import ethers from 'ethers';

export default new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
