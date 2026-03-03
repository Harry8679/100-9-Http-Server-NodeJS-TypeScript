import { IncomingMessage, ServerResponse } from 'http';
import { sendSuccess } from '../utils/response';

export const homeHandler = async (
  _req: IncomingMessage,
  res:  ServerResponse
): Promise<void> => {
  sendSuccess(res, {
    message:   'Bienvenue sur mon HTTP Server natif 🚀',
    version:   '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /',
      'GET  /health',
      'GET  /users',
      'GET  /users/:id',
      'POST /users',
      'PUT  /users/:id',
      'DELETE /users/:id',
    ],
  });
};

export const healthHandler = async (
  _req: IncomingMessage,
  res:  ServerResponse
): Promise<void> => {
  sendSuccess(res, {
    status:  'OK',
    uptime:  `${Math.floor(process.uptime())}s`,
    memory:  process.memoryUsage(),
    nodeVersion: process.version,
  });
};