import { Router } from "express";
import {
	healthCheckController,
	isConnectedController,
} from "../controllers/index.controller.js";
import { streamify } from "../utils/sse.helper.js";

const router = Router();

router.get("/health", healthCheckController);
router.get("/connected", isConnectedController);

// SSE routes
router.get("/sse/connected", streamify(isConnectedController, 500));

export default router;
