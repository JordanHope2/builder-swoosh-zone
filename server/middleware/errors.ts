import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = (typeof (err)?.status === 'number') ? (err).status : 500;
  const message = err instanceof Error ? err.message : 'Unexpected error';
  res.status(status).json({ error: message });
};
