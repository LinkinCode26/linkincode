import { Router } from "express";
import { postLead, getLeads } from "../controllers/leads.controller.js";
import leadsRateLimit from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", leadsRateLimit, postLead);
router.get("/", protect, getLeads);

export default router;
