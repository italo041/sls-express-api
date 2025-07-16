import { ScheduleController } from '../../presentation/controllers/schedule.controller';
import { DynamoScheduleRepository } from '../repositories/dynamodb/dynamo-schedule.repository';
import { ScheduleUseCaseImpl } from '../../application/use-cases/schedule.use-case';

export class DependencyInjection {
  private static scheduleController: ScheduleController;

  static getScheduleController(): ScheduleController {
    if (!this.scheduleController) {
      const scheduleRepository = new DynamoScheduleRepository();
      const scheduleUseCase = new ScheduleUseCaseImpl(scheduleRepository);
      this.scheduleController = new ScheduleController(scheduleUseCase);
    }

    return this.scheduleController;
  }
}
