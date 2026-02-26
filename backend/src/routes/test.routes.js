import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Only logged-in users
router.get("/private", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed protected route",
    user: req.user
  });
});

// Only Admin
router.get("/admin", protect, authorize("Admin"), (req, res) => {
  res.json({
    success: true,
    message: "Admin route accessed"
  });
});

export default router;