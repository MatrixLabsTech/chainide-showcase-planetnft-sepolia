import { BlockInfo, BlockInfos, BlockSyncStatus } from '@/interfaces/blockInfo.interface';
import { Low } from '@huanshiwushuang/lowdb';
import { JSONFile } from '@huanshiwushuang/lowdb/node';
import blockInfoData from '../db/blockInfo.json';

export class BlockInfoDao {
  private db: Low<BlockInfos>;
  constructor() {
    this.init();
  }

  private async init() {
    this.db = await new Low(new JSONFile<BlockInfos>('./src/db/blockInfo.json'), blockInfoData);
  }

  async selectOne(): Promise<BlockInfo> {
    return this.db.data.blockInfos.at(0);
  }

  async upsert(oldBlockNumber: number, newBlockNumber: number, status: BlockSyncStatus): Promise<void> {
    if (this.db.data.blockInfos.length > 0) {
      this.db.data.blockInfos.shift();
    }
    this.db.data.blockInfos.push({
      oldBlockNumber,
      newBlockNumber,
      status,
      time: Date.now(),
    });
    await this.db.write();
  }
}

export default new BlockInfoDao();
