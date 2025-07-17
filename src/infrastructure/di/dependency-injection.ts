import { AppointmentRequestController } from '../../presentation/controllers/appointment-request.controller';
import { DynamoAppointmentRequestRepository } from '../repositories/dynamodb/dynamo-appointment-request.repository';
import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { SNSService } from '../services/sns.service';

export class DependencyInjection {
  private static appointmentRequestController: AppointmentRequestController;
  private static appointmentRequestUseCase: AppointmentRequestUseCaseImpl;

  static getAppointmentRequestUseCase(): AppointmentRequestUseCaseImpl {
    if (!this.appointmentRequestUseCase) {
      const scheduleRepository = new DynamoAppointmentRequestRepository();
      const snsService = new SNSService();
      this.appointmentRequestUseCase = new AppointmentRequestUseCaseImpl(scheduleRepository, snsService);
    }

    return this.appointmentRequestUseCase;
  }

  static getAppointmentRequestController(): AppointmentRequestController {
    if (!this.appointmentRequestController) {
      const scheduleUseCase = this.getAppointmentRequestUseCase();
      this.appointmentRequestController = new AppointmentRequestController(scheduleUseCase);
    }

    return this.appointmentRequestController;
  }
}
