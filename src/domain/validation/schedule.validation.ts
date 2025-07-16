import Joi from 'joi';
import { CreateScheduleDto } from '../entities/schedule.entity';

export const createScheduleDtoSchema = Joi.object<CreateScheduleDto>({
  insureId: Joi.string().required().length(5).messages({
    'string.empty': 'insureId no puede estar vacío',
    'string.length': 'insureId debe tener exactamente 5 caracteres',
    'any.required': 'insureId es requerido',
  }),

  scheduleId: Joi.number().integer().positive().required().messages({
    'number.base': 'scheduleId debe ser un número',
    'number.integer': 'scheduleId debe ser un número entero',
    'number.positive': 'scheduleId debe ser un número positivo',
    'any.required': 'scheduleId es requerido',
  }),

  countryISO: Joi.string().valid('PE', 'CL').messages({
    'any.only': 'countryISO solo puede ser PE o CL',
    'string.length': 'countryISO solo debe tener 2 caracteres',
    'string.pattern.base': 'countryISO solo debe contener letras mayúsculas',
    'any.required': 'countryISO es requerido',
  }),
});

export const validateCreateScheduleDto = (data: any): { error?: Joi.ValidationError; value?: CreateScheduleDto } => {
  return createScheduleDtoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
};

export const getValidationErrorMessages = (error: Joi.ValidationError): string[] => {
  return error.details.map(detail => detail.message);
};
