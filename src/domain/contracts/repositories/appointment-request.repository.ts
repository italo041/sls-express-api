import {
  AppointmentRequest,
  CreateAppointmentRequestDto,
  GetAllAppointmentRequestDto,
  UpdateAppointmentRequestDto,
} from '../../entities/appointment-request.entity';

export interface AppointmentRequestRepository {
  create(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest>;
  findAll(getAllAppointmentRequestDto: GetAllAppointmentRequestDto): Promise<AppointmentRequest[]>;
  update(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest>;
}
