import { Router } from 'express';
import healthRoutes from './health.js';
import leadsRoutes from './leads.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/leads', leadsRoutes);

export default router;