import { Metadata } from '@/interfaces/metadata.interface';
import { HttpException } from '@exceptions/HttpException';

class MetadataService {
  public metadataList: Metadata[] = [];

  public async uploadMetadata(metadata: Metadata): Promise<void> {
    const index: number = this.metadataList.findIndex(data => data.tokenId == metadata.tokenId);
    if (index > -1) {
      this.metadataList.splice(index, 1);
    }
    this.metadataList.push(metadata);
  }

  public async getMetadata(tokenId: number): Promise<Metadata> {
    const metadata: Metadata = this.metadataList.find(metadata => metadata.tokenId == tokenId);
    if (!metadata) throw new HttpException(409, "Metadata doesn't exist");
    return metadata;
  }
}

export default MetadataService;
