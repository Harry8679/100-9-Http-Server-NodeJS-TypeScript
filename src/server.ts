import * as http from 'http';
import { Router }           from './router/router';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { corsMiddleware }   from './middlewares/cors.middleware';
import { homeHandler, healthHandler } from './handlers/home.handler';
import {
  getUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from './handlers/users.handler';

const PORT   = process.env.PORT ? parseInt(process.env.PORT) : 6000;
const router = new Router();

// ─── Middlewares ──────────────────────────────────────
router.use(corsMiddleware);
router.use(loggerMiddleware);

// ─── Routes ───────────────────────────────────────────
router.get('/',           homeHandler);
router.get('/health',     healthHandler);
router.get('/users',      getUsersHandler);
router.get('/users/:id',  getUserByIdHandler);
router.post('/users',     createUserHandler);
router.put('/users/:id',  updateUserHandler);
router.delete('/users/:id', deleteUserHandler);

// ─── Serveur HTTP natif ───────────────────────────────
const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(PORT, () => {
  console.log('╔══════════════════════════════════╗');
  console.log('║   🌐 HTTP Server natif v1.0       ║');
  console.log(`║   http://localhost:${PORT}           ║`);
  console.log('╚══════════════════════════════════╝');
  console.log('\n  Routes disponibles :');
  console.log('  GET    /');
  console.log('  GET    /health');
  console.log('  GET    /users');
  console.log('  GET    /users/:id');
  console.log('  POST   /users');
  console.log('  PUT    /users/:id');
  console.log('  DELETE /users/:id');
  console.log('\n  En attente de requêtes...\n');
});