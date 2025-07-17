import { Repository } from 'typeorm';
import { AppointmentRepository } from '../../../domain/contracts/repositories/appointment.repository';
import { AppointmentTypeOrmEntity } from './entities/appointment.entity';
import { AppDataSource } from '../../config/mysql-pe.client';
import { AppointmentStatus, CreateAppointmentDto } from '../../../domain/entities/appointment.entity';

export class AppointmentRepositoryImpl implements AppointmentRepository {
  private repository: Repository<AppointmentTypeOrmEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(AppointmentTypeOrmEntity);
  }

  async create(data: CreateAppointmentDto): Promise<AppointmentTypeOrmEntity> {
    try {
      const appointment = this.repository.create({
        ...data,
        state: AppointmentStatus.COMPLETED,
      });

      return await this.repository.save(appointment);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }
}
