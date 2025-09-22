import { healthCheck } from "../../controllers/v1/healthCheck.controller.ts";
import express, { Router } from "express";

const router: Router = express.Router();

// Health check
router.get('/health', healthCheck);

export default router;