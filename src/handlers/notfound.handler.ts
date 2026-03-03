import { IncomingMessage, ServerResponse } from 'http';
import { sendNotFound } from '../utils/response';

export const notFoundHandler = async (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  sendNotFound(res, req.url ?? '/');
};