import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppointmentTypeOrmEntity } from '../repositories/mysql/entities/appointment.entity';

const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST_PE || 'localhost',
  port: parseInt(process.env.DB_PORT_PE || '3306'),
  username: process.env.DB_USERNAME_PE || 'root',
  password: process.env.DB_PASSWORD_PE || '',
  database: process.env.DB_NAME_PE || 'appointment_db',
  ssl:
    process.env.NODE_ENV === 'production'
      ? {
          rejectUnauthorized: false,
        }
      : false,
  synchronize: true,
  logging: false,
  entities: [AppointmentTypeOrmEntity],
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  connectTimeout: 20000,
  acquireTimeout: 20000,
};

export const AppDataSource = new DataSource(databaseConfig);

export const initializeDatabase = async (): Promise<DataSource> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection initialized successfully');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed successfully');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

    await AppDataSource.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};
