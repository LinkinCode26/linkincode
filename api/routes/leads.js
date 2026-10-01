import { Router } from "express";
import { postLead, getLeads, patchLeadStatus, getLeadStats } from "../controllers/leads.controller.js";
import leadsRateLimit from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", leadsRateLimit, postLead);
router.get("/stats", protect, getLeadStats);
router.get("/", protect, getLeads);
router.patch("/:id", protect, patchLeadStatus)
export default router;
