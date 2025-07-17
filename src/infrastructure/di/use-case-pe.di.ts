import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { AppointmentUseCaseImpl } from '../../application/use-cases/appointment.use-case';
import { DynamoAppointmentRequestRepository } from '../repositories/dynamodb/dynamo-appointment-request.repository';
import { AppointmentRepositoryImpl } from '../repositories/mysql/pe/appointment.repository';
import { EventBridgeServiceImpl } from '../services/eventbridge.service';
import { SNSService } from '../services/sns.service';

export class UseCasePEDI {
  private static appointmentUseCase: AppointmentUseCaseImpl;
  private static appointmentRequestUseCase: AppointmentRequestUseCaseImpl;

  static getAppointmentUseCase(): AppointmentUseCaseImpl {
    if (!this.appointmentUseCase) {
      const appointmentRepository = new AppointmentRepositoryImpl();
      const eventBridgeService = new EventBridgeServiceImpl();
      this.appointmentUseCase = new AppointmentUseCaseImpl(appointmentRepository, eventBridgeService);
    }
    return this.appointmentUseCase;
  }

  static getAppointmentRequestUseCase(): AppointmentRequestUseCaseImpl {
    if (!this.appointmentRequestUseCase) {
      const appointmentRequestRepository = new DynamoAppointmentRequestRepository();
      const snsService = new SNSService();
      this.appointmentRequestUseCase = new AppointmentRequestUseCaseImpl(appointmentRequestRepository, snsService);
    }

    return this.appointmentRequestUseCase;
  }
}
