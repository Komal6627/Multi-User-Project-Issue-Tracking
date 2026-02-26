import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protect = async (req, res, next) => {
  try {
    console.log("Protect middleware triggered");

    // 1️⃣ Check Authorization header
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Fallback to cookie (optional)
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    console.log("Token from header/cookie:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);

    // Fetch user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    req.user = currentUser; // attach user to request
    next();
  } catch (err) {
    console.log("Protect middleware error:", err.message);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};

// Role-based authorization

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    next();
  };
};