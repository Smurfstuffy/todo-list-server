/* eslint-disable no-console */
import {z} from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('8080').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  ACCESS_SECRET: z.string().min(1, 'ACCESS_SECRET is required'),
  REFRESH_SECRET: z.string().min(1, 'REFRESH_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;
