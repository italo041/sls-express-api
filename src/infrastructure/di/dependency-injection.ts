import { TemplateController } from '../../presentation/controllers/template.controller';
import { TemplateUseCaseImpl } from '../../application/use-cases/template.use-case';
import { InMemoryTemplateRepository } from '../repositories/in-memory-template.repository';

export class DependencyInjection {
  private static templateController: TemplateController;

  static getTemplateController(): TemplateController {
    if (!this.templateController) {
      const templateRepository = new InMemoryTemplateRepository();
      const templateUseCase = new TemplateUseCaseImpl(templateRepository);
      this.templateController = new TemplateController(templateUseCase);
    }
    
    return this.templateController;
  }
}
