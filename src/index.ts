/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import {config} from './config';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
