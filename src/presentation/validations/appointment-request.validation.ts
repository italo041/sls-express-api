import Joi from 'joi';
import { CreateAppointmentRequestDto, GetAllAppointmentRequestDto } from '../../domain/entities/appointment-request.entity';

export const createAppointmentRequestDtoSchema = Joi.object<CreateAppointmentRequestDto>({
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

  countryISO: Joi.string().valid('PE', 'CL').required().messages({
    'any.only': 'countryISO solo puede ser PE o CL',
    'string.length': 'countryISO solo debe tener 2 caracteres',
    'string.pattern.base': 'countryISO solo debe contener letras mayúsculas',
    'any.required': 'countryISO es requerido',
  }),
});

export const getAllAppointmentRequestDtoSchema = Joi.object<GetAllAppointmentRequestDto>({
  insureId: Joi.string().optional().length(5).messages({
    'string.empty': 'insureId no puede estar vacío',
    'string.length': 'insureId debe tener exactamente 5 caracteres',
  }),
})
  .options({
    allowUnknown: false,
    stripUnknown: false,
  })
  .messages({
    'object.unknown': 'El parámetro "{#label}" no está permitido',
  });

export const validateCreateAppointmentRequestDto = (data: any): { error?: Joi.ValidationError; value?: CreateAppointmentRequestDto } => {
  return createAppointmentRequestDtoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
};

export const validateGetAllAppointmentRequestDto = (data: any): { error?: Joi.ValidationError; value?: GetAllAppointmentRequestDto } => {
  return getAllAppointmentRequestDtoSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
};

export const getValidationErrorMessages = (error: Joi.ValidationError): string[] => {
  return error.details.map(detail => detail.message);
};
