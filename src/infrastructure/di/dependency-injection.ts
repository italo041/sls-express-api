import { AppointmentRequestController } from '../../presentation/controllers/appointment-request.controller';
import { DynamoAppointmentRequestRepository } from '../repositories/dynamodb/dynamo-appointment-request.repository';
import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { SNSService } from '../services/sns.service';
import { AppointmentUseCaseImpl } from '../../application/use-cases/appointment.use-case';
import { AppointmentRepositoryImpl } from '../repositories/mysql/appointment.repository';

export class DependencyInjection {
  private static appointmentRequestController: AppointmentRequestController;
  private static appointmentRequestUseCase: AppointmentRequestUseCaseImpl;
  private static appointmentUseCase: AppointmentUseCaseImpl;

  static getAppointmentRequestUseCase(): AppointmentRequestUseCaseImpl {
    if (!this.appointmentRequestUseCase) {
      const appointmentRequestRepository = new DynamoAppointmentRequestRepository();
      const snsService = new SNSService();
      this.appointmentRequestUseCase = new AppointmentRequestUseCaseImpl(appointmentRequestRepository, snsService);
    }

    return this.appointmentRequestUseCase;
  }

  static getAppointmentRequestController(): AppointmentRequestController {
    if (!this.appointmentRequestController) {
      const appointmentUseCase = this.getAppointmentRequestUseCase();
      this.appointmentRequestController = new AppointmentRequestController(appointmentUseCase);
    }

    return this.appointmentRequestController;
  }

  static getAppointmentUseCase(): AppointmentUseCaseImpl {
    if (!this.appointmentUseCase) {
      const appointmentRepository = new AppointmentRepositoryImpl();
      this.appointmentUseCase = new AppointmentUseCaseImpl(appointmentRepository);
    }

    return this.appointmentUseCase;
  }
}
