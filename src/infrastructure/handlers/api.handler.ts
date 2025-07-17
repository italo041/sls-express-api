import serverless from 'serverless-http';
import { createApp } from '../http/app';

const app = createApp();

export const handler = serverless(app);
