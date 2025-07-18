import { SQSEvent } from 'aws-lambda';
import { handler } from '../../../infrastructure/handlers/sqs.handler';
import { UseCasePEDI } from '../../../infrastructure/di/use-case-pe.di';
import { UpdateAppointmentRequestDto, AppointmentRequestStatus } from '../../../domain/entities/appointment-request.entity';
import { Appointment, AppointmentStatus, CountryISO } from '../../../domain/entities/appointment.entity';

// Mock dependencies
jest.mock('../../../infrastructure/di/use-case-pe.di');

describe('SQS Handler', () => {
  let mockAppointmentRequestUseCase: any;
  let mockGetAppointmentRequestUseCase: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAppointmentRequestUseCase = {
      updateAppointmentRequest: jest.fn(),
    };

    mockGetAppointmentRequestUseCase = jest.spyOn(UseCasePEDI, 'getAppointmentRequestUseCase');
    mockGetAppointmentRequestUseCase.mockReturnValue(mockAppointmentRequestUseCase);

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('message processing', () => {
    it('should process single SQS message successfully', async () => {
      const appointmentData: Appointment = {
        id: 123,
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
        dynamoId: 'dynamo-id-123',
        state: AppointmentStatus.COMPLETED,
        createdAt: new Date(),
      };

      const mockSQSEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id-1',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              detail: appointmentData,
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:region:account:queue',
            awsRegion: 'us-east-1',
          },
        ],
      };

      const expectedUpdateDto: UpdateAppointmentRequestDto = {
        id: appointmentData.dynamoId,
        state: AppointmentRequestStatus.COMPLETED,
      };

      mockAppointmentRequestUseCase.updateAppointmentRequest.mockResolvedValue({ id: 'dynamo-id-123' });

      await handler(mockSQSEvent, {} as any, {} as any);

      expect(mockAppointmentRequestUseCase.updateAppointmentRequest).toHaveBeenCalledWith(expectedUpdateDto);
    });

    it('should handle message processing errors', async () => {
      const mockSQSEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id-1',
            receiptHandle: 'test-receipt-handle',
            body: 'invalid-json',
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:region:account:queue',
            awsRegion: 'us-east-1',
          },
        ],
      };

      await expect(handler(mockSQSEvent, {} as any, {} as any)).rejects.toThrow();
    });

    it('should handle use case errors', async () => {
      const appointmentData: Appointment = {
        id: 123,
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
        dynamoId: 'dynamo-id-123',
        state: AppointmentStatus.COMPLETED,
        createdAt: new Date(),
      };

      const mockSQSEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id-1',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              detail: appointmentData,
            }),
            attributes: {} as any,
            messageAttributes: {},
            md5OfBody: 'test-md5',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:region:account:queue',
            awsRegion: 'us-east-1',
          },
        ],
      };

      const useCaseError = new Error('UseCase failed');
      mockAppointmentRequestUseCase.updateAppointmentRequest.mockRejectedValue(useCaseError);

      await expect(handler(mockSQSEvent, {} as any, {} as any)).rejects.toThrow('UseCase failed');
    });
  });
});