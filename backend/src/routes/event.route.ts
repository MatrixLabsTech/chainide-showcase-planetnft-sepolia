import EventController from '@/controllers/event.controller';
import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';

class EventRoute implements Routes {
  public path = '/event';
  public router = Router();
  public eventController = new EventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:tokenId`, this.eventController.getEvents);
  }
}

export default EventRoute;
