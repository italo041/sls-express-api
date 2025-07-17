import { Router, Request, Response } from 'express';
import { AppointmentRequestController } from '../controllers/appointment-request.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { createAppointmentRequestDtoSchema } from '../validations/appointment-request.validation';

export function createAppointmentRequestRoutes(appointmentRequestController: AppointmentRequestController): Router {
  const router = Router();

  router.post('/', validationMiddleware(createAppointmentRequestDtoSchema), (req: Request, res: Response) => appointmentRequestController.createAppointmentRequest(req, res));
  router.get('/', (req: Request, res: Response) => appointmentRequestController.getAllAppointmentRequests(req, res));

  return router;
}
