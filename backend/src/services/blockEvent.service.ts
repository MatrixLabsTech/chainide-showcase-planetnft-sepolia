import blockEventsDao, { BlockEventsDao } from '@/dao/blockEvent.dao';
import metadataDao, { MetadataDao } from '@/dao/metadata.dao';
import { BlockEvent, EventType } from '@/interfaces/blockEvent.interface';
import { ethers } from 'ethers';

export class BlockEventService {
  private blockEventsDao: BlockEventsDao = blockEventsDao;
  private metadataDao: MetadataDao = metadataDao;

  async getBlockEvents(tokenId: number): Promise<BlockEvent[]> {
    return this.blockEventsDao.getBlockEvents(tokenId);
  }

  async addBlockEvent(blockEvent: BlockEvent): Promise<void> {
    await this.blockEventsDao.insert(blockEvent);
  }

  async handleMintEvent(event: ethers.Event): Promise<void> {
    const tokenId = event.args.tokenId.toNumber();
    const events = await this.blockEventsDao.getBlockEvent(tokenId, event.blockNumber, event.transactionHash, event.transactionIndex, EventType.Mint);
    if (events.length > 0) {
      return;
    }
    await this.addBlockEvent({
      tokenId,
      event: EventType.Mint,
      eventTime: (await event.getBlock()).timestamp,
      from: event.args.from,
      to: event.args.to,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      transactionIndex: event.transactionIndex,
    });
    await this.metadataDao.updateOwnership(tokenId, event.args.to);
  }

  async handleTransferEvent(event: ethers.Event): Promise<void> {
    const tokenId = event.args.tokenId.toNumber();
    const events = await this.blockEventsDao.getBlockEvent(
      tokenId,
      event.blockNumber,
      event.transactionHash,
      event.transactionIndex,
      EventType.Transfer,
    );
    if (events.length > 0) {
      return;
    }
    await this.addBlockEvent({
      tokenId: event.args.tokenId.toNumber(),
      event: EventType.Transfer,
      eventTime: (await event.getBlock()).timestamp,
      from: event.args.from,
      to: event.args.to,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      transactionIndex: event.transactionIndex,
    });
    await this.metadataDao.updateOwnership(tokenId, event.args.to);
  }
}

export default new BlockEventService();
