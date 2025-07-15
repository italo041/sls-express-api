import { Router, Request, Response } from 'express';
import { TemplateController } from '../controllers/template.controller';

export function createTemplateRoutes(templateController: TemplateController): Router {
  const router = Router();

  router.get('/', (req: Request, res: Response) => templateController.getAllTemplates(req, res));

  return router;
}
