import { BlockEvent, BlockEvents, EventType } from '@/interfaces/blockEvent.interface';
import { Low } from '@huanshiwushuang/lowdb';
import { JSONFile } from '@huanshiwushuang/lowdb/node';
import blockEvents from '../db/blockEvents.json';

export class BlockEventsDao {
  private db: Low<BlockEvents>;
  constructor() {
    this.init();
  }

  private async init() {
    this.db = await new Low(new JSONFile<BlockEvents>('./src/db/blockEvents.json'), blockEvents);
  }

  async getBlockEvents(tokenId: number): Promise<BlockEvent[]> {
    const events = this.db.data.blockEvents.filter(blockInfo => blockInfo.tokenId == tokenId).sort((a, b) => a.eventTime < b.eventTime);
    return events;
  }

  async getBlockEvent(
    tokenId: number,
    blockNumber: number,
    transactionHash: string,
    transactionIndex: number,
    eventType: EventType,
  ): Promise<BlockEvent[]> {
    return this.db.data.blockEvents.filter(blockInfo => {
      return (
        blockInfo.tokenId === tokenId &&
        blockInfo.blockNumber === blockNumber &&
        blockInfo.transactionHash === transactionHash &&
        blockInfo.transactionIndex === transactionIndex &&
        blockInfo.event === eventType
      );
    });
  }

  async insert(blockEvent: BlockEvent): Promise<void> {
    this.db.data.blockEvents.push(blockEvent);
    await this.db.write();
  }
}

export default new BlockEventsDao();
