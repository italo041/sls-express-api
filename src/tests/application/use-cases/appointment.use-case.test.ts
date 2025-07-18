import { AppointmentUseCaseImpl } from '../../../application/use-cases/appointment.use-case';
import { AppointmentRepository } from '../../../domain/contracts/repositories/appointment.repository';
import { EventBridgeService } from '../../../domain/interfaces/eventbridge.interface';
import {
  Appointment,
  CreateAppointmentDto,
  CountryISO,
  AppointmentStatus,
} from '../../../domain/entities/appointment.entity';

describe('AppointmentUseCaseImpl', () => {
  let appointmentUseCase: AppointmentUseCaseImpl;
  let mockAppointmentRepository: jest.Mocked<AppointmentRepository>;
  let mockEventBridgeService: jest.Mocked<EventBridgeService>;

  beforeEach(() => {
    mockAppointmentRepository = {
      create: jest.fn(),
    };

    mockEventBridgeService = {
      publishAppointmentCreatedEvent: jest.fn(),
    };

    appointmentUseCase = new AppointmentUseCaseImpl(
      mockAppointmentRepository,
      mockEventBridgeService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create appointment successfully and publish event', async () => {
      // Arrange
      const createDto: CreateAppointmentDto = {
        insureId: 'insure-123',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const expectedAppointment: Appointment = {
        id: 123,
        insureId: 'insure-123',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.PENDING,
        dynamoId: 'dynamo-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      mockAppointmentRepository.create.mockResolvedValue(expectedAppointment);
      mockEventBridgeService.publishAppointmentCreatedEvent.mockResolvedValue(undefined);

      // Act
      const result = await appointmentUseCase.createAppointment(createDto);

      // Assert
      expect(result).toEqual(expectedAppointment);
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEventBridgeService.publishAppointmentCreatedEvent).toHaveBeenCalledWith(expectedAppointment);
    });

    it('should handle repository error when creating appointment', async () => {
      // Arrange
      const createDto: CreateAppointmentDto = {
        insureId: 'insure-123',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const error = new Error('Repository error');
      mockAppointmentRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(appointmentUseCase.createAppointment(createDto)).rejects.toThrow('Repository error');
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEventBridgeService.publishAppointmentCreatedEvent).not.toHaveBeenCalled();
    });

    it('should handle event bridge service error when creating appointment', async () => {
      // Arrange
      const createDto: CreateAppointmentDto = {
        insureId: 'insure-123',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const appointment: Appointment = {
        id: 123,
        insureId: 'insure-123',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentStatus.PENDING,
        dynamoId: 'dynamo-123',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      const eventError = new Error('Event Bridge service error');
      mockAppointmentRepository.create.mockResolvedValue(appointment);
      mockEventBridgeService.publishAppointmentCreatedEvent.mockRejectedValue(eventError);

      // Act & Assert
      await expect(appointmentUseCase.createAppointment(createDto)).rejects.toThrow('Event Bridge service error');
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEventBridgeService.publishAppointmentCreatedEvent).toHaveBeenCalledWith(appointment);
    });

    it('should create appointment with different country ISO', async () => {
      // Arrange
      const createDto: CreateAppointmentDto = {
        insureId: 'insure-456',
        scheduleId: 789,
        countryISO: CountryISO.CL,
      };

      const expectedAppointment: Appointment = {
        id: 456,
        insureId: 'insure-456',
        scheduleId: 789,
        countryISO: CountryISO.CL,
        state: AppointmentStatus.PENDING,
        dynamoId: 'dynamo-456',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      };

      mockAppointmentRepository.create.mockResolvedValue(expectedAppointment);
      mockEventBridgeService.publishAppointmentCreatedEvent.mockResolvedValue(undefined);

      // Act
      const result = await appointmentUseCase.createAppointment(createDto);

      // Assert
      expect(result).toEqual(expectedAppointment);
      expect(result.countryISO).toBe(CountryISO.CL);
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEventBridgeService.publishAppointmentCreatedEvent).toHaveBeenCalledWith(expectedAppointment);
    });

    it('should handle edge case with minimal appointment data', async () => {
      // Arrange
      const createDto: CreateAppointmentDto = {
        insureId: '',
        scheduleId: 0,
        countryISO: CountryISO.PE,
      };

      const error = new Error('Invalid data');
      mockAppointmentRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(appointmentUseCase.createAppointment(createDto)).rejects.toThrow('Invalid data');
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockEventBridgeService.publishAppointmentCreatedEvent).not.toHaveBeenCalled();
    });
  });
});
