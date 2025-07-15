import { Template } from '../entities/template.entity';

// Repositorio para la persistencia de datos
export interface TemplateRepository {
  findAll(): Promise<Template[]>;
}

// Use case para la lógica de negocio
export interface TemplateUseCase {
  getAllTemplates(): Promise<Template[]>;
}
