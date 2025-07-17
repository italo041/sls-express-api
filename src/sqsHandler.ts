import { SQSHandler, SQSEvent } from 'aws-lambda';
import { DependencyInjection } from './infrastructure/di/dependency-injection';
import { ScheduleState, UpdateScheduleDto } from './domain/entities/schedule.entity';

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log(`Received ${event.Records.length} messages from SQS`);

  const scheduleUseCase = DependencyInjection.getScheduleUseCase();

  for (const record of event.Records) {
    try {
      console.log(`Processing message ID: ${record.messageId}`);
      console.log(`Message body: ${record.body}`);

      const snsMessage = JSON.parse(record.body);
      const messagePayload = snsMessage.detail;
      console.log(`Schedule data:`, messagePayload);

      const updateScheduleDto: UpdateScheduleDto = {
        id: messagePayload.dynamoId,
        state: ScheduleState.COMPLETED,
      };

      const schedule = await scheduleUseCase.updateSchedule(updateScheduleDto);
      console.log(`Schedule updated successfully:`, schedule);
      console.log(`Message ${record.messageId} processed successfully`);
    } catch (error) {
      console.error(`Error processing message ${record.messageId}:`, error);
      throw error;
    }
  }

  console.log('All messages processed successfully');
};
