import { Schedule, CreateScheduleDto } from '../../domain/entities/schedule.entity';
import { ScheduleRepository, ScheduleUseCase } from '../../domain/repositories/schedule.repository';
import { SNSService } from '../../infrastructure/services/sns.service';

export class ScheduleUseCaseImpl implements ScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private snsService: SNSService
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      const schedule = await this.scheduleRepository.create(createScheduleDto);

      await this.snsService.publishScheduleCreated(schedule);

      return schedule;
    } catch (error) {
      console.error('Error in createSchedule use case:', error);
      throw error;
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    try {
      return await this.scheduleRepository.findAll();
    } catch (error) {
      console.error('Error in getAllSchedules use case:', error);
      throw error;
    }
  }
}
