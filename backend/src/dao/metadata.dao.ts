import { HttpException } from '@/exceptions/HttpException';
import { Metadata, Metadatas } from '@/interfaces/metadata.interface';
import { Low } from '@huanshiwushuang/lowdb';
import { JSONFile } from '@huanshiwushuang/lowdb/node';
import { error } from 'console';

export class MetadataDao {
  private db: Low<Metadatas>;
  constructor() {
    this.init();
  }

  private async init() {
    const defaultData: Metadatas = { metadatas: [] };
    this.db = await new Low(new JSONFile<Metadatas>('metadata.json'), defaultData);
  }

  async upsert(metadata: Metadata): Promise<void> {
    const index: number = this.db.data.metadatas.findIndex(data => data.tokenId == metadata.tokenId);
    let owner = '';
    if (index > -1) {
      owner = this.db.data.metadatas[index].owner;
      this.db.data.metadatas.splice(index, 1);
    }
    metadata.owner = owner;
    this.db.data.metadatas.push(metadata);
    await this.db.write();
  }

  async updateOwnership(tokenId: number, owner: string): Promise<void> {
    const metadata = this.db.data.metadatas.find(data => data.tokenId == tokenId);
    if (!metadata) {
      error('metadata does not exists.');
      return;
    }
    metadata.owner = owner;
    await this.db.write();
  }

  async getMetadata(tokenId: number): Promise<Metadata> {
    const metadata = this.db.data.metadatas.find(data => data.tokenId == tokenId);
    if (!metadata) {
      throw new HttpException(409, 'metadata does not exists.');
    }
    return metadata;
  }

  async getMetadataByIds(tokenIds: number[]): Promise<Metadata[]> {
    return this.db.data.metadatas.filter(data => tokenIds.includes(Number(data.tokenId)));
  }
}

export default new MetadataDao();
