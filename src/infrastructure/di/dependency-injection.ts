import { TemplateController } from '../../presentation/controllers/template.controller';
import { TemplateUseCaseImpl } from '../../application/use-cases/template.use-case';
import { InMemoryTemplateRepository } from '../repositories/in-memory-template.repository';
import { ScheduleController } from '../../presentation/controllers/schedule.controller';
import { DynamoScheduleRepository } from '../repositories/dynamodb/dynamo-schedule.repository';
import { ScheduleUseCaseImpl } from '../../application/use-cases/schedule.use-case';

export class DependencyInjection {
  private static templateController: TemplateController;
  private static scheduleController: ScheduleController;

  static getTemplateController(): TemplateController {
    if (!this.templateController) {
      const templateRepository = new InMemoryTemplateRepository();
      const templateUseCase = new TemplateUseCaseImpl(templateRepository);
      this.templateController = new TemplateController(templateUseCase);
    }

    return this.templateController;
  }

  static getScheduleController(): ScheduleController {
    if (!this.scheduleController) {
      const scheduleRepository = new DynamoScheduleRepository();
      const scheduleUseCase = new ScheduleUseCaseImpl(scheduleRepository);
      this.scheduleController = new ScheduleController(scheduleUseCase);
    }

    return this.scheduleController;
  }
}
