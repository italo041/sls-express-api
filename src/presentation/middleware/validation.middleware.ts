import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiResponse } from '../../domain/interfaces/api.interface';
import { getValidationErrorMessages } from '../validations/appointment-request.validation';

export const validationMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessages = getValidationErrorMessages(error);
      const response: ApiResponse = {
        success: false,
        error: 'Validation failed',
        message: errorMessages.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    req.body = value;
    next();
  };
};

export const queryValidationMiddleware = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessages = getValidationErrorMessages(error);
      const response: ApiResponse = {
        success: false,
        error: 'Query validation failed',
        message: errorMessages.join(', '),
      };
      res.status(400).json(response);
      return;
    }

    req.query = value;
    next();
  };
};
