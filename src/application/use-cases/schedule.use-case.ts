import { Schedule, CreateScheduleDto } from '../../domain/entities/schedule.entity';
import { ScheduleRepository, ScheduleUseCase } from '../../domain/repositories/schedule.repository';
import { NotificationService } from '../../domain/interfaces/notification.interface';

export class ScheduleUseCaseImpl implements ScheduleUseCase {
  constructor(
    private scheduleRepository: ScheduleRepository,
    private notificationService: NotificationService
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      const schedule = await this.scheduleRepository.create(createScheduleDto);

      await this.notificationService.publishScheduleCreated(schedule);

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
