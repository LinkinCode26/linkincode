import { Router } from 'express';
import healthRoutes from './health.js';
import leadsRoutes from './leads.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/leads', leadsRoutes);
router.use('/auth', authRoutes);

export default router;