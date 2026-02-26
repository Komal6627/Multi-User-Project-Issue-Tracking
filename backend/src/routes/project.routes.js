import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { createProject, assignMember, getProjects } from "../controllers/project.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const router = express.Router();

router.post("/", protect, authorize(["Admin"]), asyncHandler(createProject));
router.post("/:projectId/assign", protect, authorize(["Admin"]), assignMember);
router.get("/", protect, getProjects);


export default router;