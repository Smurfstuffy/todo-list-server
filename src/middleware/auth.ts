import {Response, NextFunction} from 'express-serve-static-core';
import {verifyToken} from '../utils/jwt';
import {config} from '../config';
import {AuthRequest} from '../types/request';

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({message: 'Unauthorized: No token provided'});
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token, config.ACCESS_SECRET);
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !decoded.id ||
      !decoded.username
    ) {
      res.status(403).json({message: 'Forbidden: Invalid token'});
      return;
    }

    req.user = {id: decoded.id, username: decoded.username};
    next();
  } catch {
    res.status(403).json({message: 'Forbidden: Invalid token'});
    return;
  }
};
