import { BlockInfo, BlockInfos, BlockSyncStatus } from '@/interfaces/blockInfo.interface';
import { Low } from '@huanshiwushuang/lowdb';
import { JSONFile } from '@huanshiwushuang/lowdb/node';

export class BlockInfoDao {
  private db: Low<BlockInfos>;
  constructor() {
    this.init();
  }

  private async init() {
    const defaultData: BlockInfos = {
      blockInfos: [
        {
          oldBlockNumber: 38562545,
          newBlockNumber: 38562545,
          status: 'Finished',
          time: 1710439331693,
        },
      ],
    };
    this.db = await new Low(new JSONFile<BlockInfos>('blockInfo.json'), defaultData);
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
