import { Router } from "express";
import { postLead } from "../controllers/leads.controller.js";
const router = Router()

router.post("/", postLead)

export default router