import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { NotificationMessage, NotificationService } from '../../domain/interfaces/notification.interface';
import { AppointmentRequest } from '../../domain/entities/appointment-request.entity';

export class SNSService implements NotificationService {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }

  async publishMessage(notificationMessage: NotificationMessage): Promise<void> {
    try {

      if (!notificationMessage.topicArn || notificationMessage.topicArn.trim() === '') {
        throw new Error('SNS Topic ARN is missing or empty');
      }

      const command = new PublishCommand({
        TopicArn: notificationMessage.topicArn,
        Message: notificationMessage.message,
        Subject: notificationMessage.subject,
        MessageAttributes: notificationMessage.messageAttributes,
      });

      const result = await this.snsClient.send(command);
      console.log('SNS message sent successfully:', result.MessageId);
    } catch (error) {
      console.error('Error sending SNS message:', error);
      throw new Error('Failed to send SNS notification');
    }
  }

  async publishAppointmentRequestCreated(appointmentRequest: AppointmentRequest): Promise<void> {
    const message = JSON.stringify({
      eventType: 'APPOINTMENT_REQUEST_CREATED',
      scheduleId: appointmentRequest.scheduleId,
      insureId: appointmentRequest.insureId,
      countryISO: appointmentRequest.countryISO,
      state: appointmentRequest.state,
      dynamoId: appointmentRequest.id,
      timestamp: new Date().toISOString(),
    });

    await this.publishMessage({
      topicArn: process.env.SNS_TOPIC_ARN || '',
      message,
      subject: 'Appointment Request Created',
      messageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'APPOINTMENT_REQUEST_CREATED',
        },
        country: {
          DataType: 'String',
          StringValue: appointmentRequest.countryISO,
        },
      },
    });
  }
}
