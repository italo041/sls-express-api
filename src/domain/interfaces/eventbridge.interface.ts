import { Appointment } from "../entities/appointment.entity";

export interface EventBridgeService {
  publishAppointmentCreatedEvent(event: Appointment): Promise<void>;
}
