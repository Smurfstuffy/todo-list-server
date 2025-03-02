import {Request, Response} from 'express-serve-static-core';
import bcrypt from 'bcryptjs';
import {createUser, findUserByUsername} from '../models/user.model';
import {UserDTO, userSchema} from '../dtos/user.dto';

import {findRefreshToken, saveToken} from '../models/token.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/jwt';
import {config} from '../config';
import {AuthResponse} from '../types/response';

export const register = async (
  req: Request<unknown, unknown, UserDTO>,
  res: Response<AuthResponse>,
) => {
  try {
    const parsedBody = userSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({message: 'Invalid request body'});
      return;
    }

    const {username, password} = parsedBody.data;

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      res.status(400).json({message: 'User already exists'});
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, hashedPassword);

    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(user.id, user.username);

    await saveToken(user.id, refreshToken, accessToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
    });
  } catch {
    res.status(500).json({message: 'Internal Server Error'});
  }
};

export const login = async (
  req: Request<unknown, unknown, UserDTO>,
  res: Response<AuthResponse>,
) => {
  try {
    const parsedBody = userSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({message: 'Invalid request body'});
      return;
    }

    const {username, password} = parsedBody.data;

    const user = await findUserByUsername(username);
    if (!user) {
      res
        .status(404)
        .json({message: 'User with such username is not registered'});
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({message: 'Invalid credentials'});
      return;
    }

    const accessToken = generateAccessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(user.id, user.username);

    await saveToken(user.id, refreshToken, accessToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.json({
      message: 'User logged in successfully',
      accessToken,
    });
  } catch {
    res.status(500).json({message: 'Internal Server Error'});
    return;
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).json({message: 'Refresh token missing'});
      return;
    }

    const decoded = verifyToken(refreshToken, config.REFRESH_SECRET);
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !decoded.id ||
      !decoded.username
    ) {
      res.status(403).json({message: 'Invalid refresh token'});
      return;
    }

    const storedToken = await findRefreshToken(refreshToken);
    if (!storedToken) {
      res.status(403).json({message: 'Invalid or expired refresh token'});
      return;
    }

    const newAccessToken = generateAccessToken(decoded.id, decoded.username);

    await saveToken(decoded.id, refreshToken, newAccessToken);

    res.json({
      message: 'Access token refreshed',
      accessToken: newAccessToken,
    });
  } catch {
    res.status(500).json({message: 'Internal Server Error'});
    return;
  }
};
