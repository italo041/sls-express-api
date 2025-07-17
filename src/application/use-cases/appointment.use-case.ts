import { AppointmentUseCase } from '../../domain/contracts/use-cases/appointment.use-case';
import { AppointmentRepository } from '../../domain/contracts/repositories/appointment.repository';
import { Appointment, CreateAppointmentDto } from '../../domain/entities/appointment.entity';
import { EventBridgeService } from '../../domain/interfaces/eventbridge.interface';

export class AppointmentUseCaseImpl implements AppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private eventBridgeService: EventBridgeService
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.create(createAppointmentDto);
      await this.eventBridgeService.publishAppointmentCreatedEvent(appointment);

      console.log('Appointment created and event published:', appointment);

      return appointment;
    } catch (error) {
      console.error('Error in createAppointment use case:', error);
      throw error;
    }
  }
}
