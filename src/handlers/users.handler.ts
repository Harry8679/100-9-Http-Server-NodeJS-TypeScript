import { IncomingMessage, ServerResponse } from 'http';
import { RouteParams } from '../types/server.types';
import {
  sendSuccess,
  sendError,
  parseBody,
  parseQuery,
} from '../utils/response';

// Simule une base de données en mémoire
interface User {
  id:    number;
  name:  string;
  email: string;
  age:   number;
}

let users: User[] = [
  { id: 1, name: 'Harry Mezui', email: 'harry@example.com', age: 28 },
  { id: 2, name: 'Alice Martin', email: 'alice@example.com', age: 25 },
  { id: 3, name: 'Bob Dupont',   email: 'bob@example.com',   age: 32 },
];

let nextId = 4;

// GET /users
export const getUsersHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  const query = parseQuery(req.url ?? '');

  let result = [...users];

  // Filtre par nom si query param présent
  if (query.name) {
    result = result.filter((u) =>
      u.name.toLowerCase().includes(query.name.toLowerCase())
    );
  }

  sendSuccess(res, { users: result, total: result.length });
};

// GET /users/:id
export const getUserByIdHandler = async (
  _req: IncomingMessage,
  res:  ServerResponse,
  params?: RouteParams
): Promise<void> => {
  const id   = parseInt(params?.id ?? '');
  const user = users.find((u) => u.id === id);

  if (!user) {
    sendError(res, `Utilisateur ${id} introuvable`, 404);
    return;
  }

  sendSuccess(res, user);
};

// POST /users
export const createUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  try {
    const body = await parseBody(req);
    const { name, email, age } = body as Partial<User>;

    if (!name || !email || !age) {
      sendError(res, 'name, email et age sont requis', 400);
      return;
    }

    // Vérifie email unique
    if (users.find((u) => u.email === email)) {
      sendError(res, 'Email déjà utilisé', 409);
      return;
    }

    const newUser: User = { id: nextId++, name, email, age };
    users.push(newUser);

    sendSuccess(res, newUser, 201);
  } catch (err) {
    sendError(res, 'Corps de requête invalide', 400);
  }
};

// PUT /users/:id
export const updateUserHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  params?: RouteParams
): Promise<void> => {
  try {
    const id    = parseInt(params?.id ?? '');
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      sendError(res, `Utilisateur ${id} introuvable`, 404);
      return;
    }

    const body = await parseBody(req);
    users[index] = { ...users[index], ...(body as Partial<User>), id };

    sendSuccess(res, users[index]);
  } catch {
    sendError(res, 'Corps de requête invalide', 400);
  }
};

// DELETE /users/:id
export const deleteUserHandler = async (
  _req: IncomingMessage,
  res:  ServerResponse,
  params?: RouteParams
): Promise<void> => {
  const id      = parseInt(params?.id ?? '');
  const initial = users.length;
  users         = users.filter((u) => u.id !== id);

  if (users.length === initial) {
    sendError(res, `Utilisateur ${id} introuvable`, 404);
    return;
  }

  sendSuccess(res, { message: `Utilisateur ${id} supprimé` });
};