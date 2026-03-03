import { ServerResponse } from 'http';
import { ApiResponse } from '../types/server.types';

export const sendJson = <T>(
  res: ServerResponse,
  statusCode: number,
  body: ApiResponse<T>
): void => {
  const json = JSON.stringify(body);

  res.writeHead(statusCode, {
    'Content-Type':  'application/json',
    'Content-Length': Buffer.byteLength(json),
  });

  res.end(json);
};

export const sendSuccess = <T>(
  res: ServerResponse,
  data: T,
  statusCode: number = 200
): void => {
  sendJson(res, statusCode, { success: true, data });
};

export const sendError = (
  res: ServerResponse,
  message: string,
  statusCode: number = 400
): void => {
  sendJson(res, statusCode, { success: false, error: message });
};

export const sendNotFound = (res: ServerResponse, path: string): void => {
  sendError(res, `Route introuvable : ${path}`, 404);
};

// Parse le body d'une requête POST/PUT
export const parseBody = (req: { on: Function; }): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      // Protection contre les gros payloads
      if (body.length > 1e6) {
        reject(new Error('Payload trop grand'));
      }
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON invalide'));
      }
    });

    req.on('error', reject);
  });
};

// Parse les query params de l'URL (?name=harry&age=28)
export const parseQuery = (url: string): Record<string, string> => {
  const queryString = url.split('?')[1] ?? '';
  if (!queryString) return {};

  return Object.fromEntries(
    queryString.split('&').map((pair) => {
      const [key, value] = pair.split('=');
      return [
        decodeURIComponent(key ?? ''),
        decodeURIComponent(value ?? ''),
      ];
    })
  );
};