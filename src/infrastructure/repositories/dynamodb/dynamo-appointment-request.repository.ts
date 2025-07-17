import { PutCommand, DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import {
  AppointmentRequest,
  CreateAppointmentRequestDto,
  AppointmentRequestStatus,
  UpdateAppointmentRequestDto,
  GetAllAppointmentRequestDto,
} from '../../../domain/entities/appointment-request.entity';
import { AppointmentRequestRepository } from '../../../domain/contracts/repositories/appointment-request.repository';
import { DynamoDBClientConfig } from '../../config/dynamodb.client';
import * as uuid from 'uuid';

export class DynamoAppointmentRequestRepository implements AppointmentRequestRepository {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = DynamoDBClientConfig.getInstance();
    this.tableName = process.env.APPOINTMENTS_REQUEST_TABLE || 'sls-express-api-appointments-requests-dev';
  }

  async create(createAppointmentRequestDto: CreateAppointmentRequestDto): Promise<AppointmentRequest> {
    try {
      const { insureId, scheduleId, countryISO } = createAppointmentRequestDto;

      const appointmentRequest: AppointmentRequest = {
        id: uuid.v1(),
        insureId,
        scheduleId,
        countryISO,
        state: AppointmentRequestStatus.PENDING,
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: appointmentRequest,
      });

      await this.docClient.send(command);
      return appointmentRequest;
    } catch (error) {
      console.error('Error creating appointment request:', error);
      throw new Error('Failed to create appointment request');
    }
  }

  async findAll(getAllAppointmentRequestDto: GetAllAppointmentRequestDto): Promise<AppointmentRequest[]> {
    try {
      const { insureId } = getAllAppointmentRequestDto || {};

      const scanParams: any = {
        TableName: this.tableName,
      };

      const filterExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      if (insureId) {
        filterExpressions.push('#insureId = :insureId');
        expressionAttributeNames['#insureId'] = 'insureId';
        expressionAttributeValues[':insureId'] = insureId;
      }

      if (filterExpressions.length > 0) {
        scanParams.FilterExpression = filterExpressions.join(' AND ');
        scanParams.ExpressionAttributeNames = expressionAttributeNames;
        scanParams.ExpressionAttributeValues = expressionAttributeValues;
      }

      const command = new ScanCommand(scanParams);

      const result = await this.docClient.send(command);
      return (result.Items as AppointmentRequest[]) || [];
    } catch (error) {
      console.error('Error fetching all appointment requests:', error);
      throw new Error('Failed to fetch appointment requests');
    }
  }

  async update(updateAppointmentRequestDto: UpdateAppointmentRequestDto): Promise<AppointmentRequest> {
    try {
      const { id, state } = updateAppointmentRequestDto;

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: 'SET #state = :state',
        ExpressionAttributeNames: {
          '#state': 'state',
        },
        ExpressionAttributeValues: {
          ':state': state,
        },
        ReturnValues: 'ALL_NEW',
      });

      const result = await this.docClient.send(command);
      return result.Attributes as AppointmentRequest;
    } catch (error) {
      console.error('Error updating appointment request:', error);
      throw new Error('Failed to update appointment request');
    }
  }
}
