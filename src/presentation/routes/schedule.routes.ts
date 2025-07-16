import { Router, Request, Response } from 'express';
import { ScheduleController } from '../controllers/schedule.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createScheduleDtoSchema } from '../../domain/validation/schedule.validation';

export function createScheduleRoutes(scheduleController: ScheduleController): Router {
  const router = Router();

  router.post('/', 
    validationMiddleware(createScheduleDtoSchema),
    (req: Request, res: Response) => scheduleController.createSchedule(req, res)
  );

  return router;
}
