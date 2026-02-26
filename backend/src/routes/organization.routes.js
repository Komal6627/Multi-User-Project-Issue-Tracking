import express from "express";
import { inviteMember } from "../controllers/organization.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Only Admins can invite members
router.post("/invite", protect, authorize(["Admin"]), asyncHandler(inviteMember));

export default router;