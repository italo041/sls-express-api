import { Schedule, CreateScheduleDto } from '../entities/schedule.entity';

export interface ScheduleRepository {
  create(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  findAll(): Promise<Schedule[]>;
}

export interface ScheduleUseCase {
  createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  getAllSchedules(): Promise<Schedule[]>;
}
