import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TimestampEntity } from './timestamp.entity';
import { Appointment, AppointmentStatus, CountryISO } from '../../../../domain/entities/appointment.entity';

@Entity('appointment')
export class AppointmentTypeOrmEntity extends TimestampEntity implements Appointment {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'insure_id', type: 'char', length: 5 })
  insureId!: string;

  @Column({ name: 'schedule_id', type: 'int' })
  scheduleId!: number;

  @Column({
    type: 'enum',
    enum: CountryISO,
    name: 'country_iso',
  })
  countryISO!: CountryISO;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  state!: AppointmentStatus;

  @Column({ name: 'dynamo_id', type: 'varchar', length: 36 })
  dynamoId!: string;
}
