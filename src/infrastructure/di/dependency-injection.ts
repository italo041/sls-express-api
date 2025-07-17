import { ScheduleController } from '../../presentation/controllers/schedule.controller';
import { DynamoScheduleRepository } from '../repositories/dynamodb/dynamo-schedule.repository';
import { ScheduleUseCaseImpl } from '../../application/use-cases/schedule.use-case';
import { SNSService } from '../services/sns.service';

export class DependencyInjection {
  private static scheduleController: ScheduleController;
  private static scheduleUseCase: ScheduleUseCaseImpl;

  static getScheduleUseCase(): ScheduleUseCaseImpl {
    if (!this.scheduleUseCase) {
      const scheduleRepository = new DynamoScheduleRepository();
      const snsService = new SNSService();
      this.scheduleUseCase = new ScheduleUseCaseImpl(scheduleRepository, snsService);
    }

    return this.scheduleUseCase;
  }

  static getScheduleController(): ScheduleController {
    if (!this.scheduleController) {
      const scheduleUseCase = this.getScheduleUseCase();
      this.scheduleController = new ScheduleController(scheduleUseCase);
    }

    return this.scheduleController;
  }
}
