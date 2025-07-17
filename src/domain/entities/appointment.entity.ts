export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface Appointment {
  id: number;
  insureId: string;
  scheduleId: number;
  countryISO: CountryISO;
  state: AppointmentStatus;
  dynamoId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateAppointmentDto {
  insureId: string;
  scheduleId: number;
  countryISO: CountryISO;
}
