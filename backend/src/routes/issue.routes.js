import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js"
import { createIssue, updateIssue, addComment } from "../controllers/issue.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", protect, authorize(["Admin", "Member"]), asyncHandler(createIssue));
router.put("/:issueId", protect, authorize(["Admin", "Member"]), updateIssue);
router.post("/:issueId/comment", protect, authorize(["Admin", "Member"]), addComment);

export default router;