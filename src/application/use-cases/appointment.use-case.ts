import { AppointmentUseCase } from '../../domain/contracts/use-cases/appointment.use-case';
import { AppointmentRepository } from '../../domain/contracts/repositories/appointment.repository';
import { Appointment, CreateAppointmentDto } from '../../domain/entities/appointment.entity';

export class AppointmentUseCaseImpl implements AppointmentUseCase {
  constructor(
    private appointmentRepository: AppointmentRepository,
  ) {}

  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.create(createAppointmentDto);
      return appointment;
    } catch (error) {
      console.error('Error in createAppointment use case:', error);
      throw error;
    }
  }
}
