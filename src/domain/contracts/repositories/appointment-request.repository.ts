import { AppointmentRequest, CreateAppointmentRequestDto, UpdateAppointmentRequestDto } from '../../entities/appointment-request.entity';

export interface AppointmentRequestRepository {
  create(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest>;
  findAll(): Promise<AppointmentRequest[]>;
  update(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest>;
}
