import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { SNSService } from '../../../infrastructure/services/sns.service';
import { NotificationMessage } from '../../../domain/interfaces/notification.interface';
import { AppointmentRequest, AppointmentRequestStatus, CountryISO } from '../../../domain/entities/appointment-request.entity';

// Mock AWS SDK
jest.mock('@aws-sdk/client-sns');

describe('SNSService', () => {
  let snsService: SNSService;
  let mockSNSClient: jest.Mocked<SNSClient>;
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockSNSClient = {
      send: mockSend,
    } as any;

    (SNSClient as jest.MockedClass<typeof SNSClient>).mockImplementation(() => mockSNSClient);

    snsService = new SNSService();

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('publishMessage', () => {
    const mockNotificationMessage: NotificationMessage = {
      topicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
      message: 'Test message',
      subject: 'Test subject',
      messageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: 'TEST_EVENT',
        },
      },
    };

    it('should publish message successfully', async () => {
      const mockResponse = {
        MessageId: 'message-id-123',
      };

      mockSend.mockResolvedValue(mockResponse);

      await snsService.publishMessage(mockNotificationMessage);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(PublishCommand).toHaveBeenCalledWith({
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        Message: 'Test message',
        Subject: 'Test subject',
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: 'TEST_EVENT',
          },
        },
      });
    });

    it('should throw error when topic ARN is missing', async () => {
      const invalidMessage: NotificationMessage = {
        topicArn: '',
        message: 'Test message',
      };

      await expect(snsService.publishMessage(invalidMessage)).rejects.toThrow(
        'Failed to send SNS notification'
      );

      expect(console.error).toHaveBeenCalledWith(
        'Error sending SNS message:',
        expect.objectContaining({
          message: 'SNS Topic ARN is missing or empty',
        })
      );
    });

    it('should handle SNS client errors', async () => {
      const snsError = new Error('SNS service error');
      mockSend.mockRejectedValue(snsError);

      await expect(snsService.publishMessage(mockNotificationMessage)).rejects.toThrow(
        'Failed to send SNS notification'
      );

      expect(console.error).toHaveBeenCalledWith('Error sending SNS message:', snsError);
    });
  });

  describe('publishAppointmentRequestCreated', () => {
    const mockAppointmentRequest: AppointmentRequest = {
      id: 'dynamo-id-123',
      insureId: '12345',
      scheduleId: 456,
      countryISO: CountryISO.PE,
      state: AppointmentRequestStatus.PENDING,
    };

    beforeEach(() => {
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-01-01T10:00:00.000Z');
    });

    it('should publish appointment request created event successfully', async () => {
      process.env.SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:appointment-topic';
      
      mockSend.mockResolvedValue({ MessageId: 'message-id-789' });

      await snsService.publishAppointmentRequestCreated(mockAppointmentRequest);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(PublishCommand).toHaveBeenCalledWith({
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:appointment-topic',
        Message: expect.stringContaining('"eventType":"APPOINTMENT_REQUEST_CREATED"'),
        Subject: 'Appointment Request Created',
        MessageAttributes: {
          eventType: {
            DataType: 'String',
            StringValue: 'APPOINTMENT_REQUEST_CREATED',
          },
          country: {
            DataType: 'String',
            StringValue: 'PE',
          },
        },
      });

      delete process.env.SNS_TOPIC_ARN;
    });

    it('should handle missing topic ARN environment variable', async () => {
      delete process.env.SNS_TOPIC_ARN;

      await expect(snsService.publishAppointmentRequestCreated(mockAppointmentRequest)).rejects.toThrow(
        'Failed to send SNS notification'
      );
      
      expect(console.error).toHaveBeenCalledWith(
        'Error sending SNS message:',
        expect.objectContaining({
          message: 'SNS Topic ARN is missing or empty',
        })
      );
    });

    it('should handle different country ISO codes', async () => {
      process.env.SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:appointment-topic';
      
      const clAppointmentRequest: AppointmentRequest = {
        ...mockAppointmentRequest,
        countryISO: CountryISO.CL,
      };

      mockSend.mockResolvedValue({ MessageId: 'message-id-cl' });

      await snsService.publishAppointmentRequestCreated(clAppointmentRequest);

      expect(PublishCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          TopicArn: 'arn:aws:sns:us-east-1:123456789012:appointment-topic',
          Message: expect.stringContaining('"countryISO":"CL"'),
          MessageAttributes: expect.objectContaining({
            country: {
              DataType: 'String',
              StringValue: 'CL',
            },
          }),
        })
      );

      delete process.env.SNS_TOPIC_ARN;
    });
  });
});
