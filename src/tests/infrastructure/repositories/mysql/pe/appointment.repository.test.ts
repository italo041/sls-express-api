import { AppointmentRepositoryImpl } from '../../../../../infrastructure/repositories/mysql/pe/appointment.repository';
import { AppointmentTypeOrmEntity } from '../../../../../infrastructure/repositories/mysql/pe/entities/appointment.entity';
import { AppDataSource } from '../../../../../infrastructure/config/mysql-pe.client';
import { Repository } from 'typeorm';
import { AppointmentStatus, CountryISO, CreateAppointmentDto } from '../../../../../domain/entities/appointment.entity';

// Mock dependencies
jest.mock('../../../../../infrastructure/config/mysql-pe.client');

describe('AppointmentRepositoryImpl (PE)', () => {
  let repository: AppointmentRepositoryImpl;
  let mockTypeOrmRepository: jest.Mocked<Repository<AppointmentTypeOrmEntity>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTypeOrmRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockTypeOrmRepository);

    repository = new AppointmentRepositoryImpl();
  });

  describe('create', () => {
    it('should create an appointment successfully', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const mockCreatedEntity = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.COMPLETED,
      };

      const mockSavedEntity = {
        id: 1,
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.COMPLETED,
        dynamoId: 'dynamo-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AppointmentTypeOrmEntity;

      mockTypeOrmRepository.create.mockReturnValue(mockCreatedEntity as AppointmentTypeOrmEntity);
      mockTypeOrmRepository.save.mockResolvedValue(mockSavedEntity);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockSavedEntity);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith({
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.COMPLETED,
      });
      expect(mockTypeOrmRepository.save).toHaveBeenCalledWith(mockCreatedEntity);
    });

    it('should set state to COMPLETED by default', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      mockTypeOrmRepository.create.mockReturnValue({} as AppointmentTypeOrmEntity);
      mockTypeOrmRepository.save.mockResolvedValue({} as AppointmentTypeOrmEntity);

      await repository.create(createDto);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          state: AppointmentStatus.COMPLETED,
        })
      );
    });

    it('should throw an error when repository save fails', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      mockTypeOrmRepository.create.mockReturnValue({} as AppointmentTypeOrmEntity);
      mockTypeOrmRepository.save.mockRejectedValue(new Error('Database connection error'));

      await expect(repository.create(createDto)).rejects.toThrow('Failed to create appointment');
    });

    it('should throw an error when repository create fails', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      mockTypeOrmRepository.create.mockImplementation(() => {
        throw new Error('Entity creation error');
      });

      await expect(repository.create(createDto)).rejects.toThrow('Failed to create appointment');
    });

    it('should handle different country ISO values', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 789,
        countryISO: CountryISO.CL,
      };

      const mockSavedEntity = {
        id: 2,
        insureId: '55555',
        scheduleId: 789,
        countryISO: CountryISO.CL,
        state: AppointmentStatus.COMPLETED,
        dynamoId: 'dynamo-456',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as AppointmentTypeOrmEntity;

      mockTypeOrmRepository.create.mockReturnValue({} as AppointmentTypeOrmEntity);
      mockTypeOrmRepository.save.mockResolvedValue(mockSavedEntity);

      const result = await repository.create(createDto);

      expect(result).toEqual(mockSavedEntity);
      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          countryISO: CountryISO.CL,
        })
      );
    });

    it('should preserve all input data in the created entity', async () => {
      const createDto: CreateAppointmentDto = {
        insureId: '55555',
        scheduleId: 12345,
        countryISO: CountryISO.PE,
      };

      mockTypeOrmRepository.create.mockReturnValue({} as AppointmentTypeOrmEntity);
      mockTypeOrmRepository.save.mockResolvedValue({} as AppointmentTypeOrmEntity);

      await repository.create(createDto);

      expect(mockTypeOrmRepository.create).toHaveBeenCalledWith({
        insureId: '55555',
        scheduleId: 12345,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.COMPLETED,
      });
    });
  });

  describe('constructor', () => {
    it('should initialize repository with correct entity', () => {
      const newRepository = new AppointmentRepositoryImpl();

      expect(AppDataSource.getRepository).toHaveBeenCalledWith(AppointmentTypeOrmEntity);
    });
  });
});
