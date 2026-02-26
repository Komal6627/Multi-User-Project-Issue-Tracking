import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerService = async (data) => {
  const { name, email, password, role, organizationName } = data;

  if (!role || role !== "Admin") {
    throw new Error("Only Admin can register and create organization");
  }

  if (!organizationName) {
    throw new Error("Organization name is required for Admin registration");
  }

  // 1️⃣ Create organization first
  const organization = await Organization.create({
    name: organizationName,
    createdBy: null
  });

  // 2️⃣ Create Admin user
  const user = await User.create({
    name,
    email,
    password,
    role,
    organization: organization._id
  });

  // 3️⃣ Update organization with createdBy
  organization.createdBy = user._id;
  await organization.save();

  return user;
};

// export const loginService = async (email, password) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error("Invalid credentials");

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch) throw new Error("Invalid credentials");

//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user);

//   user.refreshToken = refreshToken;
//   await user.save();

//   return { accessToken, refreshToken, user };
// };

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  // Generate access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, organization: user.organization },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
  );

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};


export const refreshTokenService = async (token) => {
  const user = await User.findOne({ refreshToken: token });
  if (!user) throw new Error("Invalid refresh token");

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { newAccessToken, newRefreshToken };
};

export const logoutService = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};