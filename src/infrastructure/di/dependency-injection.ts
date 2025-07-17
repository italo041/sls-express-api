import { AppointmentRequestController } from '../../presentation/controllers/appointment-request.controller';
import { DynamoAppointmentRequestRepository } from '../repositories/dynamodb/dynamo-appointment-request.repository';
import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { SNSService } from '../services/sns.service';
import { AppointmentUseCaseImpl } from '../../application/use-cases/appointment.use-case';
import { AppointmentRepositoryImpl } from '../repositories/mysql-pe/appointment.repository';
import { EventBridgeServiceImpl } from '../services/eventbridge.service';
import { AppointmentRepositoryImpl as AppointmentRepositoryImplCL } from '../repositories/mysql-cl/appointment.repository';

export class DependencyInjection {
  private static appointmentRequestController: AppointmentRequestController;
  private static appointmentRequestUseCase: AppointmentRequestUseCaseImpl;
  private static appointmentUseCase: AppointmentUseCaseImpl;
  private static appointmentUseCaseCL: AppointmentUseCaseImpl;

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
      const eventBridgeService = new EventBridgeServiceImpl();
      this.appointmentUseCase = new AppointmentUseCaseImpl(appointmentRepository, eventBridgeService);
    }

    return this.appointmentUseCase;
  }

  static getAppointmentUseCaseCL(): AppointmentUseCaseImpl {
    if (!this.appointmentUseCaseCL) {
      const appointmentRepository = new AppointmentRepositoryImplCL();
      const eventBridgeService = new EventBridgeServiceImpl();
      this.appointmentUseCaseCL = new AppointmentUseCaseImpl(appointmentRepository, eventBridgeService);
    }

    return this.appointmentUseCaseCL;
  }
}
