import { Router } from "express";
import {
	healthCheckController,
	isConnectedController,
} from "../controllers/index.controller.js";

const router = Router();

router.get("/health", healthCheckController);
router.get("/connected", isConnectedController);

export default router;
