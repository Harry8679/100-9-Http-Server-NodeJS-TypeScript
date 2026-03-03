import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from '../types/server.types';

export const corsMiddleware: Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Requête preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  next();
};