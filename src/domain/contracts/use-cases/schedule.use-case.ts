import { Schedule, CreateScheduleDto } from '../../entities/schedule.entity';

export interface ScheduleUseCase {
  createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  getAllSchedules(): Promise<Schedule[]>;
}
