import type { RequestHandler, Request, Response, NextFunction } from 'express';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => (req, res, next) => { void fn(req, res, next).catch(next); };
