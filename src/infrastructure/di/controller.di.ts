import { AppointmentRequestController } from '../../presentation/controllers/appointment-request.controller';
import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { DynamoAppointmentRequestRepository } from '../repositories/dynamodb/dynamo-appointment-request.repository';
import { SNSService } from '../services/sns.service';

export class ControllerDI {
  private static appointmentRequestController: AppointmentRequestController;

  static getAppointmentRequestController(): AppointmentRequestController {
    if (!this.appointmentRequestController) {
      const appointmentRequestRepository = new DynamoAppointmentRequestRepository();
      const snsService = new SNSService();
      const appointmentRequestUseCase = new AppointmentRequestUseCaseImpl(appointmentRequestRepository, snsService);

      this.appointmentRequestController = new AppointmentRequestController(appointmentRequestUseCase);
    }

    return this.appointmentRequestController;
  }
}
