import { BlockEvent } from '@/interfaces/blockEvent.interface';
import blockEventService, { BlockEventService } from '@/services/blockEvent.service';
import { NextFunction, Request, Response } from 'express';

class EventController {
  private blockEventService: BlockEventService = blockEventService;

  public getEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blockEvents: BlockEvent[] = await this.blockEventService.getBlockEvents(req.params.tokenId);
      res.status(200).json(blockEvents);
    } catch (error) {
      next(error);
    }
  };
}

export default EventController;
