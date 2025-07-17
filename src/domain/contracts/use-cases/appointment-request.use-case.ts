import { AppointmentRequest, CreateAppointmentRequestDto, UpdateAppointmentRequestDto } from '../../entities/appointment-request.entity';

export interface AppointmentRequestUseCase {
  createAppointmentRequest(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest>;
  getAllAppointmentRequests(): Promise<AppointmentRequest[]>;
  updateAppointmentRequest(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest>;
}
