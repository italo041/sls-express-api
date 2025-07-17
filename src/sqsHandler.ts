import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DependencyInjection } from './infrastructure/di/dependency-injection';
import { AppointmentRequestStatus, UpdateAppointmentRequestDto } from './domain/entities/appointment-request.entity';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(`Received ${event.Records.length} messages from SQS`);

  const appointmentRequestUseCase = DependencyInjection.getAppointmentRequestUseCase();

  for (const record of event.Records) {
    try {
      console.log(`Processing message ID: ${record.messageId}`);
      console.log(`Message body: ${record.body}`);

      const snsMessage = JSON.parse(record.body);
      const messagePayload = snsMessage.detail;
      console.log(`Appointment data:`, messagePayload);

      const updateAppointmentRequestDto: UpdateAppointmentRequestDto = {
        id: messagePayload.dynamoId,
        state: AppointmentRequestStatus.COMPLETED,
      };

      const appointment = await appointmentRequestUseCase.updateAppointmentRequest(updateAppointmentRequestDto);
      console.log(`Appointment updated successfully:`, appointment);
      console.log(`Message ${record.messageId} processed successfully`);
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);
      throw error;
    }
  }

  console.log('All messages processed successfully');
};
