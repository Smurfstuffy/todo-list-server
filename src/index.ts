/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {config} from './config';
import authRoutes from './routes/auth';
import testRoutes from './routes/test';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', testRoutes);

app.listen(config.PORT, () => {
  console.log(
    `Server is running in ${config.NODE_ENV} mode on port ${config.PORT}`,
  );
});
