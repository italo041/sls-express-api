import { Schedule, CreateScheduleDto } from '../../domain/entities/schedule.entity';
import { ScheduleRepository, ScheduleUseCase } from '../../domain/repositories/schedule.repository';

export class ScheduleUseCaseImpl implements ScheduleUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return await this.scheduleRepository.create(createScheduleDto);
  }
}
