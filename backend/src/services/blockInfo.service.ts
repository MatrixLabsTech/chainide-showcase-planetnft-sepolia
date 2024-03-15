import blockInfoDao, { BlockInfoDao } from '@/dao/blockInfo.dao';
import { BlockInfo, BlockSyncStatus } from '@/interfaces/blockInfo.interface';

export class BlockInfoService {
  private blockInfoDao: BlockInfoDao = blockInfoDao;

  async getBlockInfo(): Promise<BlockInfo> {
    return this.blockInfoDao.selectOne();
  }

  async startSync(fromBlock: number, toBlock: number): Promise<void> {
    await this.blockInfoDao.upsert(fromBlock, toBlock, BlockSyncStatus.InProgress);
  }

  async finishSync(fromBlock: number, toBlock: number): Promise<void> {
    await this.blockInfoDao.upsert(fromBlock, toBlock, BlockSyncStatus.Finished);
  }
}

export default new BlockInfoService();
