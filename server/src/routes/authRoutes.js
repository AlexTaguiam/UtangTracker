import { syncUser, getUserProfile } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import express from "express";

const authRouter = express.Router();
// POST /api/auth/sync - Sync user after login/signup
authRouter.post("/sync", authenticateUser, syncUser);

// GET /api/auth/profile - Get user profile
authRouter.get("/profile", authenticateUser, getUserProfile);

export default authRouter;
