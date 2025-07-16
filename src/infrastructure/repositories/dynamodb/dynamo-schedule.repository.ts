import { PutCommand, DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Schedule, CreateScheduleDto } from '../../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../../domain/contracts/repositories/schedule.repository';
import { DynamoDBClientConfig } from '../../config/dynamodb.client';
import * as uuid from 'uuid';

export class DynamoScheduleRepository implements ScheduleRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = DynamoDBClientConfig.getInstance();
    this.tableName = process.env.SCHEDULES_TABLE || 'schedules';
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      const { insureId, scheduleId, countryISO } = createScheduleDto;

      const schedule: Schedule = {
        id: uuid.v1(),
        insureId,
        scheduleId,
        countryISO,
        state: 'PENDING',
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: schedule,
      });

      await this.docClient.send(command);
      return schedule;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw new Error('Failed to create schedule');
    }
  }

  async findAll(): Promise<Schedule[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const result = await this.docClient.send(command);
      return result.Items as Schedule[] || [];
    } catch (error) {
      console.error('Error fetching all schedules:', error);
      throw new Error('Failed to fetch schedules');
    }
  }
}
