import { Request, Response } from 'express';
import { TemplateUseCase } from '../../domain/repositories/template.repository';
import { ApiResponse } from '../../domain/interfaces/api.interface';

export class TemplateController {
  constructor(private templateUseCase: TemplateUseCase) {}

  async getAllTemplates(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.templateUseCase.getAllTemplates();
      
      const response: ApiResponse = {
        success: true,
        data: users,
        message: 'Templates retrieved successfully',
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      res.status(500).json(response);
    }
  }

}
