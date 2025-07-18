import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { EventBridgeServiceImpl } from '../../../infrastructure/services/eventbridge.service';
import { Appointment, AppointmentStatus, CountryISO } from '../../../domain/entities/appointment.entity';

jest.mock('@aws-sdk/client-eventbridge');

describe('EventBridgeServiceImpl', () => {
  let eventBridgeService: EventBridgeServiceImpl;
  let mockEventBridgeClient: jest.Mocked<EventBridgeClient>;
  let mockSend: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSend = jest.fn();
    mockEventBridgeClient = {
      send: mockSend,
    } as any;

    (EventBridgeClient as jest.MockedClass<typeof EventBridgeClient>).mockImplementation(() => mockEventBridgeClient);

    eventBridgeService = new EventBridgeServiceImpl();

    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('publishAppointmentCreatedEvent', () => {
    const mockAppointment: Appointment = {
      id: 123,
      scheduleId: 456,
      insureId: '12345',
      countryISO: CountryISO.PE,
      dynamoId: 'dynamo-id-123',
      state: AppointmentStatus.COMPLETED,
      createdAt: new Date('2023-01-01T10:00:00Z'),
    };

    it('should publish appointment created event successfully', async () => {
      const mockResponse = {
        FailedEntryCount: 0,
        Entries: [
          {
            EventId: 'event-id-123',
          },
        ],
      };

      mockSend.mockResolvedValue(mockResponse);

      await eventBridgeService.publishAppointmentCreatedEvent(mockAppointment);

      expect(mockSend).toHaveBeenCalledTimes(1);
      expect(PutEventsCommand).toHaveBeenCalledWith({
        Entries: [
          {
            Source: 'appointments.source',
            DetailType: 'Appointment Created',
            Detail: JSON.stringify({
              scheduleId: 456,
              insureId: '12345',
              countryISO: 'PE',
              createdAt: '2023-01-01T10:00:00.000Z',
              dynamoId: 'dynamo-id-123',
              state: 'COMPLETED',
            }),
            EventBusName: 'event_bus_appointments',
          },
        ],
      });
    });

    it('should use custom event bus name from environment', async () => {
      process.env.EVENT_BUS_NAME = 'custom-event-bus';
      const customService = new EventBridgeServiceImpl();

      mockSend.mockResolvedValue({ FailedEntryCount: 0 });

      await customService.publishAppointmentCreatedEvent(mockAppointment);

      expect(PutEventsCommand).toHaveBeenCalledWith(
        expect.objectContaining({
          Entries: expect.arrayContaining([
            expect.objectContaining({
              EventBusName: 'custom-event-bus',
            }),
          ]),
        })
      );

      delete process.env.EVENT_BUS_NAME;
    });

    it('should handle EventBridge client errors', async () => {
      const errorMessage = 'EventBridge service error';
      const eventBridgeError = new Error(errorMessage);
      mockSend.mockRejectedValue(eventBridgeError);

      await expect(eventBridgeService.publishAppointmentCreatedEvent(mockAppointment)).rejects.toThrow(errorMessage);

      expect(console.error).toHaveBeenCalledWith('Error publishing event to EventBridge:', eventBridgeError);
    });
  });
});
