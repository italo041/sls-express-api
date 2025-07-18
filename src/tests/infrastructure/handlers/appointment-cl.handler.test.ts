import { SQSEvent } from 'aws-lambda';
import { handler } from '../../../infrastructure/handlers/appointment-cl.handler';
import { UseCaseCLDI } from '../../../infrastructure/di/use-case-cl.di';
import { initializeDatabase } from '../../../infrastructure/config/mysql-cl.client';

// Mock dependencies
jest.mock('../../../infrastructure/di/use-case-cl.di');
jest.mock('../../../infrastructure/config/mysql-cl.client');

describe('Appointment CL Handler', () => {
  let mockAppointmentUseCase: any;
  let mockInitializeDatabase: jest.MockedFunction<typeof initializeDatabase>;
  let mockGetAppointmentUseCase: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAppointmentUseCase = {
      createAppointment: jest.fn(),
    };

    mockInitializeDatabase = initializeDatabase as jest.MockedFunction<typeof initializeDatabase>;
    mockInitializeDatabase.mockResolvedValue({} as any);

    mockGetAppointmentUseCase = jest.spyOn(UseCaseCLDI, 'getAppointmentUseCase');
    mockGetAppointmentUseCase.mockReturnValue(mockAppointmentUseCase);

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('message processing', () => {
    it('should process single SQS message successfully', async () => {
      const mockSQSEvent: SQSEvent = {
        Records: [
          {
            messageId: 'test-message-id-1',
            receiptHandle: 'test-receipt-handle',
            body: JSON.stringify({
              Message: JSON.stringify({
                insureId: '12345',
                scheduleId: '123',
                countryISO: 'CL',
                dynamoId: 'dynamo-id-123',
                state: 'PENDING',
              }),
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

      const expectedCreateDto = {
        insureId: '12345',
        scheduleId: 123,
        countryISO: 'CL',
        dynamoId: 'dynamo-id-123',
        state: 'PENDING',
      };

      mockAppointmentUseCase.createAppointment.mockResolvedValue({ id: 'mysql-id-123' });

      await handler(mockSQSEvent, {} as any, {} as any);

      expect(mockInitializeDatabase).toHaveBeenCalledTimes(1);
      expect(mockAppointmentUseCase.createAppointment).toHaveBeenCalledWith(expectedCreateDto);
    });

    it('should handle database initialization errors', async () => {
      const dbError = new Error('Database connection failed');
      mockInitializeDatabase.mockRejectedValue(dbError);

      const mockSQSEvent: SQSEvent = { Records: [] };

      await expect(handler(mockSQSEvent, {} as any, {} as any)).rejects.toThrow('Database connection failed');
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
  });
});
