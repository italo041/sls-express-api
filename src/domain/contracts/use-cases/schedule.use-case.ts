import { Schedule, CreateScheduleDto, UpdateScheduleDto } from '../../entities/schedule.entity';

export interface ScheduleUseCase {
  createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  getAllSchedules(): Promise<Schedule[]>;
  updateSchedule(updateScheduleDto: UpdateScheduleDto): Promise<Schedule>;
}
