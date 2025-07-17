import {
  AppointmentRequest,
  CreateAppointmentRequestDto,
  GetAllAppointmentRequestDto,
  UpdateAppointmentRequestDto,
} from '../../entities/appointment-request.entity';

export interface AppointmentRequestUseCase {
  createAppointmentRequest(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest>;
  getAllAppointmentRequests(getAllAppointmentRequestDto: GetAllAppointmentRequestDto): Promise<AppointmentRequest[]>;
  updateAppointmentRequest(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest>;
}
