import { AppointmentUseCaseImpl } from '../../application/use-cases/appointment.use-case';
import { AppointmentRepositoryImpl } from '../repositories/mysql/cl/appointment.repository';
import { EventBridgeServiceImpl } from '../services/eventbridge.service';

export class UseCaseCLDI {
  private static appointmentUseCase: AppointmentUseCaseImpl;

  static getAppointmentUseCase(): AppointmentUseCaseImpl {
    if (!this.appointmentUseCase) {
      const appointmentRepository = new AppointmentRepositoryImpl();
      const eventBridgeService = new EventBridgeServiceImpl();
      this.appointmentUseCase = new AppointmentUseCaseImpl(appointmentRepository, eventBridgeService);
    }

    return this.appointmentUseCase;
  }
}
