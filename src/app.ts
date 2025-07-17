import express, { Request, Response } from 'express';
import { DependencyInjection } from './infrastructure/di/dependency-injection';
import { ApiResponse } from './domain/interfaces/api.interface';
import { createAppointmentRequestRoutes } from './presentation/routes/appointment-request.routes';

export function createApp(): express.Application {
  const app = express();

  // Middlewares de Express
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  app.get('/', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Serverless Express API',
      data: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints: {
          templates: '/schedules',
        },
      },
    };
    res.status(200).json(response);
  });

  app.get('/health', (req: Request, res: Response) => {
    const response: ApiResponse = {
      success: true,
      message: 'Service is healthy',
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    };
    res.status(200).json(response);
  });

  // Inyección de dependencias y configuración de rutas
  const appointmentRequestController = DependencyInjection.getAppointmentRequestController();
  app.use('/appointment-request', createAppointmentRequestRoutes(appointmentRequestController));

  // Middlewares de errores
  app.use((req: Request, res: Response) => {
    const response: ApiResponse = {
      success: false,
      error: `Route ${req.method} ${req.originalUrl} not found`,
    };
    res.status(404).json(response);
  });

  app.use((error: Error, req: Request, res: Response, next: any) => {
    console.error('Error:', error);

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Internal server error',
    };

    res.status(500).json(response);
  });

  return app;
}
