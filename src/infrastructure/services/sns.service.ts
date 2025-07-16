import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export interface SNSMessage {
  topicArn: string;
  message: string;
  subject?: string;
  messageAttributes?: Record<string, any>;
}

export class SNSService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async publishMessage(snsMessage: SNSMessage): Promise<void> {
    try {

      if (!snsMessage.topicArn || snsMessage.topicArn.trim() === '') {
        throw new Error('SNS Topic ARN is missing or empty');
      }

      const command = new PublishCommand({
        TopicArn: snsMessage.topicArn,
        Message: snsMessage.message,
        Subject: snsMessage.subject,
        MessageAttributes: snsMessage.messageAttributes,
      });

      const result = await this.snsClient.send(command);
      console.log('SNS message sent successfully:', result.MessageId);
    } catch (error) {
      console.error('Error sending SNS message:', error);
      throw new Error('Failed to send SNS notification');
    }
  }

  async publishScheduleCreated(schedule: any): Promise<void> {
    const message = JSON.stringify({
      eventType: 'SCHEDULE_CREATED',
      scheduleId: schedule.id,
      insureId: schedule.insureId,
      countryISO: schedule.countryISO,
      state: schedule.state,
      timestamp: new Date().toISOString(),
    });

    await this.publishMessage({
      topicArn: process.env.SNS_TOPIC_ARN || '',
      message,
      subject: 'Schedule Created',
      messageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'SCHEDULE_CREATED',
        },
        country: {
          DataType: 'String',
          StringValue: schedule.countryISO,
        },
      },
    });
  }
}
