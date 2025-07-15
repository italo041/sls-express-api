import { Template } from '../../domain/entities/template.entity';
import { TemplateRepository } from '../../domain/repositories/template.repository';

let templates: Template[] = [
  {
    id: '1',
    name: 'John Doe',
    description: 'John Doe is a software engineer',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    description: 'Jane Smith is a software engineer',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
];

export class InMemoryTemplateRepository implements TemplateRepository {
  async findAll(): Promise<Template[]> {
    return [...templates];
  }
}
