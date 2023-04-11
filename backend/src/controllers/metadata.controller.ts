import { UploadMetadataDto } from '@/dtos/metadata.dto';
import { Metadata } from '@/interfaces/metadata.interface';
import MetadataService from '@services/metadata.service';
import { NextFunction, Request, Response } from 'express';

class MetadataController {
  public metadataService = new MetadataService();

  public getMetadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metadata: Metadata = await this.metadataService.getMetadata(req.params.tokenId);
      console.log(metadata.attributes);
      try {
        metadata.attributes = JSON.parse(metadata.attributes);
      } catch (e) {}
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  };

  public uploadMetadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      const metadata: UploadMetadataDto = req.body;
      await this.metadataService.uploadMetadata({
        tokenId: metadata.tokenId,
        name: metadata.name,
        description: metadata.description,
        attributes: metadata.attributes,
        image: `${metadata.baseUri}/${file.filename}`,
      });
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  };

  public uploadImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      res.status(201).json({ data: file.filename });
    } catch (error) {
      next(error);
    }
  };
}

export default MetadataController;
