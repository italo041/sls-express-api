import { AppointmentRequest, CreateAppointmentRequestDto, UpdateAppointmentRequestDto } from '../../entities/appointment-request.entity';

export interface AppointmentRequestRepository {
  create(createScheduleDto: CreateAppointmentRequestDto): Promise<AppointmentRequest>;
  findAll(): Promise<AppointmentRequest[]>;
  update(schedule: UpdateAppointmentRequestDto): Promise<AppointmentRequest>;
}
