import { Template } from '../../domain/entities/template.entity';
import { TemplateRepository, TemplateUseCase } from '../../domain/repositories/template.repository';

export class TemplateUseCaseImpl implements TemplateUseCase {
  constructor(private templateRepository: TemplateRepository) {}

  async getAllTemplates(): Promise<Template[]> {
    return await this.templateRepository.findAll();
  }

}
