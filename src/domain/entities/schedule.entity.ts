export interface Schedule {
  id: string;
  insureId: string;
  scheduleId: number;
  countryISO: string;
  state: 'PENDING' | 'COMPLETED' | 'CANCELED';
}

export interface CreateScheduleDto {
  insureId: string;
  scheduleId: number;
  countryISO: string;
}
