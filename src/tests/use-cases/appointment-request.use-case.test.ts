import { AppointmentRequestUseCaseImpl } from '../../application/use-cases/appointment-request.use-case';
import { AppointmentRequestRepository } from '../../domain/contracts/repositories/appointment-request.repository';
import { NotificationService } from '../../domain/interfaces/notification.interface';
import {
  AppointmentRequest,
  CreateAppointmentRequestDto,
  GetAllAppointmentRequestDto,
  UpdateAppointmentRequestDto,
  CountryISO,
  AppointmentRequestStatus,
} from '../../domain/entities/appointment-request.entity';

describe('AppointmentRequestUseCaseImpl', () => {
  let appointmentRequestUseCase: AppointmentRequestUseCaseImpl;
  let mockAppointmentRequestRepository: jest.Mocked<AppointmentRequestRepository>;
  let mockNotificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    mockAppointmentRequestRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    mockNotificationService = {
      publishMessage: jest.fn(),
      publishAppointmentRequestCreated: jest.fn(),
    };

    appointmentRequestUseCase = new AppointmentRequestUseCaseImpl(
      mockAppointmentRequestRepository,
      mockNotificationService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointmentRequest', () => {
    it('should create appointment request successfully', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const expectedAppointmentRequest: AppointmentRequest = {
        id: 'dynamo-id-123',
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.PENDING,
      };

      mockAppointmentRequestRepository.create.mockResolvedValue(expectedAppointmentRequest);
      mockNotificationService.publishAppointmentRequestCreated.mockResolvedValue(undefined);

      const result = await appointmentRequestUseCase.createAppointmentRequest(createDto);

      expect(result).toEqual(expectedAppointmentRequest);
      expect(mockAppointmentRequestRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockNotificationService.publishAppointmentRequestCreated).toHaveBeenCalledWith(expectedAppointmentRequest);
    });

    it('should handle repository error when creating appointment request', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const error = new Error('Repository error');
      mockAppointmentRequestRepository.create.mockRejectedValue(error);

      await expect(appointmentRequestUseCase.createAppointmentRequest(createDto)).rejects.toThrow('Repository error');
      expect(mockAppointmentRequestRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockNotificationService.publishAppointmentRequestCreated).not.toHaveBeenCalled();
    });

    it('should handle notification service error when creating appointment request', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
      };

      const appointmentRequest: AppointmentRequest = {
        id: 'dynamo-id-123',
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.PENDING,
      };

      const notificationError = new Error('Notification service error');
      mockAppointmentRequestRepository.create.mockResolvedValue(appointmentRequest);
      mockNotificationService.publishAppointmentRequestCreated.mockRejectedValue(notificationError);

      await expect(appointmentRequestUseCase.createAppointmentRequest(createDto)).rejects.toThrow('Notification service error');
      expect(mockAppointmentRequestRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockNotificationService.publishAppointmentRequestCreated).toHaveBeenCalledWith(appointmentRequest);
    });
  });

  describe('getAllAppointmentRequests', () => {
    it('should get all appointment requests successfully', async () => {
      const getAllDto: GetAllAppointmentRequestDto = {
        insureId: '55555',
      };

      const expectedAppointmentRequests: AppointmentRequest[] = [
        {
          id: 'dynamo-id-1',
          insureId: '55555',
          scheduleId: 456,
          countryISO: CountryISO.PE,
          state: AppointmentRequestStatus.PENDING,
        },
        {
          id: 'dynamo-id-2',
          insureId: '55555',
          scheduleId: 789,
          countryISO: CountryISO.CL,
          state: AppointmentRequestStatus.COMPLETED,
        },
      ];

      mockAppointmentRequestRepository.findAll.mockResolvedValue(expectedAppointmentRequests);

      const result = await appointmentRequestUseCase.getAllAppointmentRequests(getAllDto);

      expect(result).toEqual(expectedAppointmentRequests);
      expect(mockAppointmentRequestRepository.findAll).toHaveBeenCalledWith(getAllDto);
    });

    it('should handle repository error when getting all appointment requests', async () => {
      const getAllDto: GetAllAppointmentRequestDto = {
        insureId: '55555',
      };

      const error = new Error('Repository error');
      mockAppointmentRequestRepository.findAll.mockRejectedValue(error);

      await expect(appointmentRequestUseCase.getAllAppointmentRequests(getAllDto)).rejects.toThrow('Repository error');
      expect(mockAppointmentRequestRepository.findAll).toHaveBeenCalledWith(getAllDto);
    });

    it('should return empty array when no appointment requests found', async () => {
      const getAllDto: GetAllAppointmentRequestDto = {
        insureId: '99999',
      };

      mockAppointmentRequestRepository.findAll.mockResolvedValue([]);

      const result = await appointmentRequestUseCase.getAllAppointmentRequests(getAllDto);

      expect(result).toEqual([]);
      expect(mockAppointmentRequestRepository.findAll).toHaveBeenCalledWith(getAllDto);
    });
  });

  describe('updateAppointmentRequest', () => {
    it('should update appointment request successfully', async () => {
      const updateDto: UpdateAppointmentRequestDto = {
        id: 'dynamo-id-123',
        state: AppointmentRequestStatus.COMPLETED,
      };

      const expectedAppointmentRequest: AppointmentRequest = {
        id: 'dynamo-id-123',
        insureId: '55555',
        scheduleId: 456,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.COMPLETED,
      };

      mockAppointmentRequestRepository.update.mockResolvedValue(expectedAppointmentRequest);

      const result = await appointmentRequestUseCase.updateAppointmentRequest(updateDto);

      expect(result).toEqual(expectedAppointmentRequest);
      expect(mockAppointmentRequestRepository.update).toHaveBeenCalledWith(updateDto);
    });

    it('should handle repository error when updating appointment request', async () => {
      const updateDto: UpdateAppointmentRequestDto = {
        id: 'dynamo-id-123',
        state: AppointmentRequestStatus.COMPLETED,
      };

      const error = new Error('Repository error');
      mockAppointmentRequestRepository.update.mockRejectedValue(error);

      await expect(appointmentRequestUseCase.updateAppointmentRequest(updateDto)).rejects.toThrow('Repository error');
      expect(mockAppointmentRequestRepository.update).toHaveBeenCalledWith(updateDto);
    });

    it('should handle not found error when updating non-existent appointment request', async () => {
      const updateDto: UpdateAppointmentRequestDto = {
        id: 'dynamo-id-not-found',
        state: AppointmentRequestStatus.COMPLETED,
      };

      const error = new Error('Appointment request not found');
      mockAppointmentRequestRepository.update.mockRejectedValue(error);

      await expect(appointmentRequestUseCase.updateAppointmentRequest(updateDto)).rejects.toThrow('Appointment request not found');
      expect(mockAppointmentRequestRepository.update).toHaveBeenCalledWith(updateDto);
    });
  });
});
