import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DependencyInjection } from './infrastructure/di/dependency-injection';
import { initializeDatabase } from './infrastructure/config/mysql-pe.client';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(`Received ${event.Records.length} messages from SQS`);

  try {
    await initializeDatabase();
    console.log('Database connection initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }

  const appointmentUseCase = DependencyInjection.getAppointmentUseCase();

  for (const record of event.Records) {
    try {
      console.log(`Processing message ID: ${record.messageId}`);
      console.log(`Message body: ${record.body}`);

      const snsMessage = JSON.parse(record.body);
      const messagePayload = JSON.parse(snsMessage.Message);
      console.log(`Appointment data:`, messagePayload);

      const createAppointmentDto = {
        insureId: messagePayload.insureId,
        scheduleId: parseInt(messagePayload.scheduleId),
        countryISO: messagePayload.countryISO,
        dynamoId: messagePayload.dynamoId,
      };

      const appointment = await appointmentUseCase.createAppointment(createAppointmentDto);
      console.log(`Appointment created successfully:`, appointment);
      console.log(`Message ${record.messageId} processed successfully`);
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);
      throw error;
    }
  }

  console.log('All messages processed successfully');
};
