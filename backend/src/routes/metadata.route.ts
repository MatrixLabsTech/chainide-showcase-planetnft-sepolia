import MetadataController from '@controllers/metadata.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

class MetadataRoute implements Routes {
  public path = '/metadata';
  public router = Router();
  public metadataController = new MetadataController();
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    },
  });
  upload = multer({ storage: this.storage });

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:tokenId`, this.metadataController.getMetadata);
    this.router.post(`${this.path}`, this.upload.single('image'), this.metadataController.uploadMetadata);
  }
}

export default MetadataRoute;
