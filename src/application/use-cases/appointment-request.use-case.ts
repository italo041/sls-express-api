import { AppointmentRequest, CreateAppointmentRequestDto, GetAllAppointmentRequestDto, UpdateAppointmentRequestDto } from '../../domain/entities/appointment-request.entity';
import { AppointmentRequestRepository } from '../../domain/contracts/repositories/appointment-request.repository';
import { AppointmentRequestUseCase } from '../../domain/contracts/use-cases/appointment-request.use-case';
import { NotificationService } from '../../domain/interfaces/notification.interface';

export class AppointmentRequestUseCaseImpl implements AppointmentRequestUseCase {
  constructor(
    private appointmentRequestRepository: AppointmentRequestRepository,
    private notificationService: NotificationService
  ) {}

  async createAppointmentRequest(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest> {
    try {
      const appointment = await this.appointmentRequestRepository.create(createAppointmentRequestDto);

      await this.notificationService.publishAppointmentRequestCreated(appointment);

      return appointment;
    } catch (error) {
      console.error('Error in createAppointmentRequest use case:', error);
      throw error;
    }
  }

  async getAllAppointmentRequests(getAllAppointmentRequestDto: GetAllAppointmentRequestDto): Promise<AppointmentRequest[]> {
    try {
      return await this.appointmentRequestRepository.findAll(getAllAppointmentRequestDto);
    } catch (error) {
      console.error('Error in getAllAppointmentRequests use case:', error);
      throw error;
    }
  }

  async updateAppointmentRequest(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest> {
    try {
      return await this.appointmentRequestRepository.update(updateAppointmentRequestDto);
    } catch (error) {
      console.error('Error in updateAppointmentRequest use case:', error);
      throw error;
    }
  }
}
