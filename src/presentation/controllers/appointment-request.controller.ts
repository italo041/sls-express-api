import { Request, Response } from 'express';
import { ApiResponse } from '../../domain/interfaces/api.interface';
import { AppointmentRequestUseCase } from '../../domain/contracts/use-cases/appointment-request.use-case';
import { CreateAppointmentRequestDto, GetAllAppointmentRequestDto } from '../../domain/entities/appointment-request.entity';

export class AppointmentRequestController {
  constructor(private appointmentRequestUseCase: AppointmentRequestUseCase) {}

  async createAppointmentRequest(req: Request, res: Response): Promise<void> {
    try {
      const appointmentRequestData: CreateAppointmentRequestDto = req.body;
      const appointmentRequests = await this.appointmentRequestUseCase.createAppointmentRequest(appointmentRequestData);

      const response: ApiResponse = {
        success: true,
        data: appointmentRequests,
        message: 'Appointment request created successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  }

  async getAllAppointmentRequests(req: Request, res: Response): Promise<void> {
    try {
      const appointmentRequestData = req.query as unknown as GetAllAppointmentRequestDto;
      const appointmentRequests = await this.appointmentRequestUseCase.getAllAppointmentRequests(appointmentRequestData);

      const response: ApiResponse = {
        success: true,
        data: appointmentRequests,
        message: 'Appointment requests fetched successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  }
}
