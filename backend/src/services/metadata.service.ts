import metadataDao, { MetadataDao } from '@/dao/metadata.dao';
import { Metadata } from '@/interfaces/metadata.interface';

export class MetadataService {
  private metadataDao: MetadataDao = metadataDao;

  public async uploadMetadata(metadata: Metadata): Promise<void> {
    await this.metadataDao.upsert(metadata);
  }

  public async getMetadata(tokenId: number): Promise<Metadata> {
    return this.metadataDao.getMetadata(tokenId);
  }

  public async getMetadataByIds(tokenIds: number[]): Promise<Metadata[]> {
    return this.metadataDao.getMetadataByIds(tokenIds);
  }
}

export default new MetadataService();
