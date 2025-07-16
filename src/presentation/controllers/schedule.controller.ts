import { Request, Response } from 'express';
import { ApiResponse } from '../../domain/interfaces/api.interface';
import { ScheduleUseCase } from '../../domain/repositories/schedule.repository';
import { CreateScheduleDto } from '../../domain/entities/schedule.entity';

export class ScheduleController {
  constructor(private scheduleUseCase: ScheduleUseCase) {}

  async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const scheduleData: CreateScheduleDto = req.body;
      const schedules = await this.scheduleUseCase.createSchedule(scheduleData);

      const response: ApiResponse = {
        success: true,
        data: schedules,
        message: 'Pending schedule created successfully',
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

  async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await this.scheduleUseCase.getAllSchedules();

      const response: ApiResponse = {
        success: true,
        data: schedules,
        message: 'Schedules fetched successfully',
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
