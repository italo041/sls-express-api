import { Appointment, CreateAppointmentDto } from "../../entities/appointment.entity";

export interface AppointmentUseCase {
  createAppointment(createAppointmentRequestDto: CreateAppointmentDto): Promise<Appointment>;
}
