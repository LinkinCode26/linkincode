import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'disconnected',
  });
});

export default router;