export enum CountryISO {
  PE = 'PE',
  CL = 'CL',
}

export enum ScheduleState {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface Schedule {
  id?: string;
  insureId?: string;
  scheduleId?: number;
  countryISO?: CountryISO;
  state?: ScheduleState;
}

export interface CreateScheduleDto {
  insureId: string;
  scheduleId: number;
  countryISO: CountryISO;
}
export interface UpdateScheduleDto {
  id: string;
  state: ScheduleState;
}
