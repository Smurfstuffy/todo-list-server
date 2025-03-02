import {Request} from 'express-serve-static-core';

export interface AuthRequest extends Request {
  user?: {id: number; username: string};
}
