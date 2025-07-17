import { Appointment, CreateAppointmentDto } from "../../entities/appointment.entity";

export interface AppointmentRepository {
  create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment>;
}
