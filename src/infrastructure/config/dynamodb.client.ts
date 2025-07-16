import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoDBClientConfig {
  private static instance: DynamoDBDocumentClient;

  static getInstance(): DynamoDBDocumentClient {
    if (!this.instance) {
      const client = new DynamoDBClient({
        region: process.env.AWS_REGION || 'us-east-1',
      });

      this.instance = DynamoDBDocumentClient.from(client);
    }

    return this.instance;
  }

  static createClient(): DynamoDBDocumentClient {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });

    return DynamoDBDocumentClient.from(client);
  }
}
