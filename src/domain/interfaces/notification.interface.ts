export interface NotificationMessage {
  topicArn: string;
  message: string;
  subject?: string;
  messageAttributes?: Record<string, any>;
}

export interface NotificationService {
  publishMessage(message: NotificationMessage): Promise<void>;
  publishAppointmentRequestCreated(appointmentRequest: any): Promise<void>;
}
