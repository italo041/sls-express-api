import { Request, Response } from 'express';
import { AppointmentRequestController } from '../../../presentation/controllers/appointment-request.controller';
import { AppointmentRequestUseCase } from '../../../domain/contracts/use-cases/appointment-request.use-case';
import { 
  CreateAppointmentRequestDto, 
  GetAllAppointmentRequestDto, 
  AppointmentRequest, 
  CountryISO, 
  AppointmentRequestStatus 
} from '../../../domain/entities/appointment-request.entity';
import { ApiResponse } from '../../../domain/interfaces/api.interface';

describe('AppointmentRequestController', () => {
  let controller: AppointmentRequestController;
  let mockUseCase: jest.Mocked<AppointmentRequestUseCase>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      createAppointmentRequest: jest.fn(),
      getAllAppointmentRequests: jest.fn(),
      updateAppointmentRequest: jest.fn(),
    };

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    controller = new AppointmentRequestController(mockUseCase);
  });

  describe('createAppointmentRequest', () => {
    it('should create appointment request successfully', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
      };

      const expectedAppointmentRequest: AppointmentRequest = {
        id: 'dynamo-id-123',
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
        state: AppointmentRequestStatus.PENDING,
      };

      const expectedResponse: ApiResponse = {
        success: true,
        data: expectedAppointmentRequest,
        message: 'Appointment request created successfully',
      };

      mockRequest.body = createDto;
      mockUseCase.createAppointmentRequest.mockResolvedValue(expectedAppointmentRequest);

      await controller.createAppointmentRequest(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.createAppointmentRequest).toHaveBeenCalledWith(createDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle use case errors and return 500 status', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
      };

      const errorMessage = 'Database connection error';
      const expectedResponse: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      mockRequest.body = createDto;
      mockUseCase.createAppointmentRequest.mockRejectedValue(new Error(errorMessage));

      await controller.createAppointmentRequest(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.createAppointmentRequest).toHaveBeenCalledWith(createDto);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle unknown errors', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '12345',
        scheduleId: 123,
        countryISO: CountryISO.PE,
      };

      const expectedResponse: ApiResponse = {
        success: false,
        error: 'Unknown error',
      };

      mockRequest.body = createDto;
      mockUseCase.createAppointmentRequest.mockRejectedValue('Not an Error object');

      await controller.createAppointmentRequest(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.createAppointmentRequest).toHaveBeenCalledWith(createDto);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle different country ISO values', async () => {
      const createDto: CreateAppointmentRequestDto = {
        insureId: '67890',
        scheduleId: 456,
        countryISO: CountryISO.CL,
      };

      const expectedAppointmentRequest: AppointmentRequest = {
        id: 'dynamo-id-123',
        insureId: '67890',
        scheduleId: 456,
        countryISO: CountryISO.CL,
        state: AppointmentRequestStatus.PENDING,
      };

      mockRequest.body = createDto;
      mockUseCase.createAppointmentRequest.mockResolvedValue(expectedAppointmentRequest);

      await controller.createAppointmentRequest(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.createAppointmentRequest).toHaveBeenCalledWith(createDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expectedAppointmentRequest,
        })
      );
    });
  });

  describe('getAllAppointmentRequests', () => {
    it('should get all appointment requests successfully', async () => {
      const queryDto: GetAllAppointmentRequestDto = {
        insureId: '12345',
      };

      const expectedAppointmentRequests: AppointmentRequest[] = [
        {
          id: 'dynamo-id-123',
          insureId: '12345',
          scheduleId: 123,
          countryISO: CountryISO.PE,
          state: AppointmentRequestStatus.PENDING,
        },
        {
          id: 'dynamo-id-456',
          insureId: '12345',
          scheduleId: 456,
          countryISO: CountryISO.CL,
          state: AppointmentRequestStatus.COMPLETED,
        },
      ];

      const expectedResponse: ApiResponse = {
        success: true,
        data: expectedAppointmentRequests,
        message: 'Appointment requests fetched successfully',
      };

      mockRequest.query = queryDto as any;
      mockUseCase.getAllAppointmentRequests.mockResolvedValue(expectedAppointmentRequests);

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.getAllAppointmentRequests).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return empty array when no appointments found', async () => {
      const queryDto: GetAllAppointmentRequestDto = {
        insureId: '99999',
      };

      const expectedAppointmentRequests: AppointmentRequest[] = [];

      const expectedResponse: ApiResponse = {
        success: true,
        data: expectedAppointmentRequests,
        message: 'Appointment requests fetched successfully',
      };

      mockRequest.query = queryDto as any;
      mockUseCase.getAllAppointmentRequests.mockResolvedValue(expectedAppointmentRequests);

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.getAllAppointmentRequests).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle use case errors and return 500 status', async () => {
      const queryDto: GetAllAppointmentRequestDto = {
        insureId: '12345',
      };

      const errorMessage = 'Database query failed';
      const expectedResponse: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      mockRequest.query = queryDto as any;
      mockUseCase.getAllAppointmentRequests.mockRejectedValue(new Error(errorMessage));

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.getAllAppointmentRequests).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle unknown errors', async () => {
      const queryDto: GetAllAppointmentRequestDto = {
        insureId: '12345',
      };

      const expectedResponse: ApiResponse = {
        success: false,
        error: 'Unknown error',
      };

      mockRequest.query = queryDto as any;
      mockUseCase.getAllAppointmentRequests.mockRejectedValue('Not an Error object');

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.getAllAppointmentRequests).toHaveBeenCalledWith(queryDto);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should handle query parameters correctly', async () => {
      const queryDto = {
        insureId: '54321',
      };

      mockRequest.query = queryDto as any;
      mockUseCase.getAllAppointmentRequests.mockResolvedValue([]);

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockUseCase.getAllAppointmentRequests).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('constructor', () => {
    it('should initialize controller with use case dependency', () => {
      const newController = new AppointmentRequestController(mockUseCase);

      expect(newController).toBeInstanceOf(AppointmentRequestController);
      expect((newController as any).appointmentRequestUseCase).toBe(mockUseCase);
    });
  });

  describe('error handling', () => {
    it('should handle null body in createAppointmentRequest', async () => {
      mockRequest.body = null;
      mockUseCase.createAppointmentRequest.mockRejectedValue(new Error('Invalid data'));

      await controller.createAppointmentRequest(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid data',
      });
    });

    it('should handle undefined query in getAllAppointmentRequests', async () => {
      mockRequest.query = undefined;
      mockUseCase.getAllAppointmentRequests.mockRejectedValue(new Error('Invalid query'));

      await controller.getAllAppointmentRequests(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid query',
      });
    });
  });
});
