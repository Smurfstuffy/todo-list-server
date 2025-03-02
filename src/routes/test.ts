import {Router} from 'express';
import {Request, Response} from 'express-serve-static-core';
import {authenticateUser} from '../middleware/auth';

const router = Router();

router.get('/test', authenticateUser, (req: Request, res: Response) => {
  res.send({message: 'Message received'});
});

export default router;
