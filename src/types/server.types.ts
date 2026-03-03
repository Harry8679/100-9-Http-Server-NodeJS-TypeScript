import { IncomingMessage, ServerResponse } from 'http';

// Handler typé — prend req/res et retourne une Promise
export type Handler = (
  req: IncomingMessage,
  res: ServerResponse,
  params?: RouteParams
) => Promise<void>;

// Middleware typé
export type Middleware = (
  req:  IncomingMessage,
  res:  ServerResponse,
  next: () => void
) => void;

// Paramètres extraits de l'URL (ex: /users/:id → { id: '123' })
export type RouteParams = Record<string, string>;

// Une route enregistrée
export interface Route {
  method:  HttpMethod;
  path:    string;
  handler: Handler;
}

// Méthodes HTTP supportées
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Corps d'une requête parsé
export type RequestBody = Record<string, unknown>;

// Format de réponse standard
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?:   T;
  message?: string;
  error?:  string;
}