import { Schedule, CreateScheduleDto, UpdateScheduleDto } from '../../entities/schedule.entity';

export interface ScheduleRepository {
  create(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
  findAll(): Promise<Schedule[]>;
  update(schedule: UpdateScheduleDto): Promise<Schedule>;
}
