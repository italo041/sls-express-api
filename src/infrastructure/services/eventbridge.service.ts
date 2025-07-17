import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventBridgeService } from '../../domain/interfaces/eventbridge.interface';
import { Appointment } from '../../domain/entities/appointment.entity';

export class EventBridgeServiceImpl implements EventBridgeService {
  private client: EventBridgeClient;
  private eventBusName: string;

  constructor() {
    this.client = new EventBridgeClient({ region: process.env.AWS_REGION || 'us-east-1' });
    this.eventBusName = process.env.EVENT_BUS_NAME || 'event_bus_appointments';
  }

  async publishAppointmentCreatedEvent(appointment: Appointment): Promise<void> {
    try {
      const command = new PutEventsCommand({
        Entries: [
          {
            Source: 'appointments.source',
            DetailType: 'Appointment Created',
            Detail: JSON.stringify({
              scheduleId: appointment.scheduleId,
              insureId: appointment.insureId,
              countryISO: appointment.countryISO,
              createdAt: appointment.createdAt.toISOString(),
              dynamoId: appointment.dynamoId,
              state: appointment.state
            }),
            EventBusName: this.eventBusName,
          },
        ],
      });

      const response = await this.client.send(command);
      console.log('Event published to EventBridge successfully:', response);
    } catch (error) {
      console.error('Error publishing event to EventBridge:', error);
      throw error;
    }
  }
}
