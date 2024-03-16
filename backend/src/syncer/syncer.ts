import { BSC_NODE_URL } from '@/config';
import abi from '@/config/abi.json';
import { BlockSyncStatus } from '@/interfaces/blockInfo.interface';
import blockEventService, { BlockEventService } from '@/services/blockEvent.service';
import blockInfoService, { BlockInfoService } from '@/services/blockInfo.service';
import { CONTRACT_ADDRESS } from '@config';
import { BaseProvider } from '@ethersproject/providers';
import { log } from 'console';
import { BaseContract, ethers } from 'ethers';
import schedule from 'node-schedule';

export class BlockSyncer {
  private provider: BaseProvider = new ethers.providers.JsonRpcProvider(BSC_NODE_URL);
  private contract: BaseContract = new ethers.Contract(CONTRACT_ADDRESS, abi, this.provider);
  private blockInfoService: BlockInfoService = blockInfoService;
  private blockEventService: BlockEventService = blockEventService;

  constructor() {
    schedule.scheduleJob('*/5 * * * * *', this.syncTask.bind(this));
  }

  async syncTask() {
    const blockNumber = await this.provider.getBlockNumber();
    const blockInfo = await this.blockInfoService.getBlockInfo();
    let fromBlock, toBlock;
    if (!blockInfo) {
      fromBlock = blockNumber - 10;
      toBlock = blockNumber;
    } else {
      if (blockInfo.status === BlockSyncStatus.InProgress) {
        fromBlock = blockInfo.oldBlockNumber - 1;
        toBlock = Math.min(fromBlock + 10, blockNumber);
      } else {
        fromBlock = blockInfo.newBlockNumber;
        toBlock = Math.min(blockInfo.newBlockNumber + 10, blockNumber);
      }
    }
    if (fromBlock > toBlock) {
      log(`fromBlock ${fromBlock} > toBlock ${toBlock}, skipping`);
      return;
    }
    log(`start syncing from ${fromBlock} to ${toBlock}`);
    await this.blockInfoService.startSync(fromBlock, toBlock);
    await this.syncTransferEvents(fromBlock, toBlock);
    await this.blockInfoService.finishSync(fromBlock, toBlock);
    log(`finish syncing from ${fromBlock} to ${toBlock}`);
  }

  async syncTransferEvents(fromBlock: number, toBlock: number): Promise<void> {
    log(`start syncing transfer events from ${fromBlock} to ${toBlock}`);
    const filteredEvents = await this.contract.queryFilter('Transfer', fromBlock, toBlock);
    for (const event of filteredEvents) {
      if (event.args.from === '0x0000000000000000000000000000000000000000') {
        await this.blockEventService.handleMintEvent(event);
      } else {
        await this.blockEventService.handleTransferEvent(event);
      }
    }
  }
}
