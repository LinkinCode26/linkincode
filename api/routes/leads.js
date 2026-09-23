import { Router } from "express";
import { postLead } from "../controllers/leads.controller.js";
import leadsRateLimit from "../middlewares/rateLimiter.js";
const router = Router();

router.post("/", leadsRateLimit, postLead);

export default router;
