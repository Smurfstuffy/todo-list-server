import jwt from 'jsonwebtoken';
import {config} from '../config';

export const generateAccessToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.ACCESS_SECRET, {expiresIn: '15m'});
};

export const generateRefreshToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.REFRESH_SECRET, {expiresIn: '7d'});
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
