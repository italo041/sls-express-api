import { DynamoAppointmentRequestRepository } from '../../../../infrastructure/repositories/dynamodb/dynamo-appointment-request.repository';
import { DynamoDBClientConfig } from '../../../../infrastructure/config/dynamodb.client';
import { PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import {
  AppointmentRequestStatus,
  CountryISO,
  CreateAppointmentRequestDto,
  GetAllAppointmentRequestDto,
  UpdateAppointmentRequestDto,
} from '../../../../domain/entities/appointment-request.entity';
import * as uuid from 'uuid';

// Mock dependencies
jest.mock('../../../../infrastructure/config/dynamodb.client');
jest.mock('uuid');

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  PutCommand: jest.fn().mockImplementation((params) => params),
  ScanCommand: jest.fn().mockImplementation((params) => params),
  UpdateCommand: jest.fn().mockImplementation((params) => params),
}));

const MockedPutCommand = PutCommand as jest.MockedClass<typeof PutCommand>;
const MockedScanCommand = ScanCommand as jest.MockedClass<typeof ScanCommand>;
const MockedUpdateCommand = UpdateCommand as jest.MockedClass<typeof UpdateCommand>;

describe('DynamoAppointmentRequestRepository', () => {
  let repository: DynamoAppointmentRequestRepository;
  let mockDocClient: any;
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockDocClient = {
      send: mockSend,
    };

    (DynamoDBClientConfig.getInstance as jest.Mock).mockReturnValue(mockDocClient);

    (uuid.v1 as jest.Mock).mockReturnValue('mocked-uuid-123');

    MockedPutCommand.mockClear();
    MockedScanCommand.mockClear();
    MockedUpdateCommand.mockClear();

    process.env.APPOINTMENTS_REQUEST_TABLE = 'test-appointments-table';

    repository = new DynamoAppointmentRequestRepository();
  });

  afterEach(() => {
    delete process.env.APPOINTMENTS_REQUEST_TABLE;
  });

  describe('create', () => {
    it('should create an appointment request successfully', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      mockSend.mockResolvedValue({});

      const result = await repository.create(createDto);

      expect(result).toEqual({
        id: 'mocked-uuid-123',
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.PENDING,
      });

      expect(MockedPutCommand).toHaveBeenCalledWith({
        TableName: 'test-appointments-table',
        Item: {
          id: 'mocked-uuid-123',
          insureId: '55555',
          scheduleId: 456,
          countryISO: CountryISO.PE,
          state: AppointmentRequestStatus.PENDING,
        },
      });

      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when DynamoDB operation fails', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      mockSend.mockRejectedValue(new Error('DynamoDB error'));

      // Act & Assert
      await expect(repository.create(createDto)).rejects.toThrow('Failed to create appointment request');
    });
  });

  describe('findAll', () => {
    it('should return all appointment requests without filter', async () => {
      const mockItems = [
        {
          id: '1',
          insureId: '55555',
          scheduleId: 456,
          countryISO: CountryISO.PE,
          state: AppointmentRequestStatus.PENDING,
        },
        {
          id: '2',
          insureId: '666666',
          scheduleId: 789,
          countryISO: CountryISO.CL,
          state: AppointmentRequestStatus.COMPLETED,
        },
      ];

      mockSend.mockResolvedValue({ Items: mockItems });

      const result = await repository.findAll({} as GetAllAppointmentRequestDto);

      expect(result).toEqual(mockItems);
      expect(MockedScanCommand).toHaveBeenCalledWith({
        TableName: 'test-appointments-table',
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should filter by insureId when provided', async () => {
      const getAllDto: GetAllAppointmentRequestDto = {
        insureId: '55555',
      };

      const mockItems = [
        {
          id: '1',
          insureId: '55555',
          scheduleId: 456,
          countryISO: CountryISO.PE,
          state: AppointmentRequestStatus.PENDING,
        },
      ];

      mockSend.mockResolvedValue({ Items: mockItems });

      const result = await repository.findAll(getAllDto);

      expect(result).toEqual(mockItems);
      expect(MockedScanCommand).toHaveBeenCalledWith({
        TableName: 'test-appointments-table',
        FilterExpression: '#insureId = :insureId',
        ExpressionAttributeNames: { '#insureId': 'insureId' },
        ExpressionAttributeValues: { ':insureId': '55555' },
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no items found', async () => {
      mockSend.mockResolvedValue({ Items: undefined });

      const result = await repository.findAll({} as GetAllAppointmentRequestDto);

      expect(result).toEqual([]);
    });

    it('should throw an error when DynamoDB scan fails', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB scan error'));

      await expect(repository.findAll({} as GetAllAppointmentRequestDto)).rejects.toThrow(
        'Failed to fetch appointment requests'
      );
    });
  });

  describe('update', () => {
    it('should update an appointment request successfully', async () => {
      const updateDto: UpdateAppointmentRequestDto = {
        id: 'appointment-123',
        state: AppointmentRequestStatus.COMPLETED,
      };

      const mockUpdatedItem = {
        id: 'appointment-123',
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.COMPLETED,
      };

      mockSend.mockResolvedValue({ Attributes: mockUpdatedItem });

      const result = await repository.update(updateDto);

      expect(result).toEqual(mockUpdatedItem);
      expect(MockedUpdateCommand).toHaveBeenCalledWith({
        TableName: 'test-appointments-table',
        Key: { id: 'appointment-123' },
        UpdateExpression: 'SET #state = :state',
        ExpressionAttributeNames: { '#state': 'state' },
        ExpressionAttributeValues: { ':state': AppointmentRequestStatus.COMPLETED },
        ReturnValues: 'ALL_NEW',
      });
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when DynamoDB update fails', async () => {
      const updateDto: UpdateAppointmentRequestDto = {
        id: 'appointment-123',
        state: AppointmentRequestStatus.COMPLETED,
      };

      mockSend.mockRejectedValue(new Error('DynamoDB update error'));

      // Act & Assert
      await expect(repository.update(updateDto)).rejects.toThrow('Failed to update appointment request');
    });
  });

  describe('constructor', () => {
    it('should use default table name when environment variable is not set', () => {
      delete process.env.APPOINTMENTS_REQUEST_TABLE;

      const newRepository = new DynamoAppointmentRequestRepository();

      expect(newRepository['tableName']).toBe('sls-express-api-appointments-requests-dev');
    });

    it('should use environment variable table name when set', () => {
      process.env.APPOINTMENTS_REQUEST_TABLE = 'custom-table-name';

      const newRepository = new DynamoAppointmentRequestRepository();

      expect(newRepository['tableName']).toBe('custom-table-name');
    });
  });
});
