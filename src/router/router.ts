import { IncomingMessage, ServerResponse } from 'http';
import {
  Route,
  Handler,
  HttpMethod,
  Middleware,
  RouteParams,
} from '../types/server.types';
import { sendNotFound } from '../utils/response';

export class Router {
  private routes:      Route[]      = [];
  private middlewares: Middleware[] = [];

  // ─── Enregistrement des middlewares ───────────────

  use(middleware: Middleware): void {
    this.middlewares.push(middleware);
  }

  // ─── Enregistrement des routes ────────────────────

  get(path: string, handler: Handler):    void { this.addRoute('GET',    path, handler); }
  post(path: string, handler: Handler):   void { this.addRoute('POST',   path, handler); }
  put(path: string, handler: Handler):    void { this.addRoute('PUT',    path, handler); }
  patch(path: string, handler: Handler):  void { this.addRoute('PATCH',  path, handler); }
  delete(path: string, handler: Handler): void { this.addRoute('DELETE', path, handler); }

  private addRoute(method: HttpMethod, path: string, handler: Handler): void {
    this.routes.push({ method, path, handler });
  }

  // ─── Matching de route avec paramètres ────────────

  private matchRoute(
    routePath: string,
    requestPath: string
  ): RouteParams | null {
    // Retire les query params
    const cleanPath = requestPath.split('?')[0];

    const routeParts   = routePath.split('/').filter(Boolean);
    const requestParts = cleanPath.split('/').filter(Boolean);

    if (routeParts.length !== requestParts.length) return null;

    const params: RouteParams = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart   = routeParts[i];
      const requestPart = requestParts[i];

      if (routePart.startsWith(':')) {
        // Paramètre dynamique → extrait la valeur
        params[routePart.slice(1)] = requestPart;
      } else if (routePart !== requestPart) {
        return null;
      }
    }

    return params;
  }

  // ─── Exécution des middlewares en chaîne ──────────

  private runMiddlewares(
    req: IncomingMessage,
    res: ServerResponse,
    index: number,
    callback: () => void
  ): void {
    if (index >= this.middlewares.length) {
      callback();
      return;
    }

    this.middlewares[index](req, res, () => {
      this.runMiddlewares(req, res, index + 1, callback);
    });
  }

  // ─── Gestionnaire principal ────────────────────────

  async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    // Exécute les middlewares d'abord
    this.runMiddlewares(req, res, 0, async () => {
      const method  = (req.method ?? 'GET') as HttpMethod;
      const url     = req.url ?? '/';
      const path    = url.split('?')[0];

      // Cherche une route correspondante
      for (const route of this.routes) {
        if (route.method !== method) continue;

        const params = this.matchRoute(route.path, path);
        if (params !== null) {
          try {
            await route.handler(req, res, params);
          } catch (err) {
            console.error('Erreur handler :', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Erreur interne' }));
          }
          return;
        }
      }

      // Aucune route trouvée
      sendNotFound(res, path);
    });
  }
}