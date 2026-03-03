import { IncomingMessage, ServerResponse } from 'http';
import { Middleware } from '../types/server.types';

export const loggerMiddleware: Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void => {
  const start  = Date.now();
  const method = req.method ?? 'GET';
  const url    = req.url ?? '/';

  // Intercepte la fin de la réponse pour logger le statusCode
  res.on('finish', () => {
    const duration  = Date.now() - start;
    const status    = res.statusCode;
    const color     = status >= 500 ? '\x1b[31m'
                    : status >= 400 ? '\x1b[33m'
                    : status >= 300 ? '\x1b[36m'
                    : '\x1b[32m';
    const reset     = '\x1b[0m';
    const timestamp = new Date().toLocaleTimeString('fr-FR');

    console.log(
      `  ${timestamp} ${color}${status}${reset} ${method.padEnd(6)} ${url} ${duration}ms`
    );
  });

  next();
};