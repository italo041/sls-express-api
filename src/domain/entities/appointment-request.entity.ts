export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

export enum AppointmentRequestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface AppointmentRequest {
  id: string;
  insureId: string;
  scheduleId: number;
  countryISO: CountryISO;
  state: AppointmentRequestStatus;
}

export interface CreateAppointmentRequestDto {
  insureId: string;
  scheduleId: number;
  countryISO: CountryISO;
}
export interface UpdateAppointmentRequestDto {
  id: string;
  state: AppointmentRequestStatus;
}

export interface GetAllAppointmentRequestDto {
  insureId: string; 
}
