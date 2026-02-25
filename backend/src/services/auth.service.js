import User from "../models/user.model.js";
import Organization from "../models/organization.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token.util.js";

export const registerService = async (data) => {
  const { name, email, password, role, organizationName } = data;

  let organization;

  if (role === "Admin") {
    organization = await Organization.create({
      name: organizationName,
      createdBy: null
    });
  } else {
    throw new Error("Only Admin can create organization during registration");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    organization: organization._id
  });

  organization.createdBy = user._id;
  await organization.save();

  return user;
};

export const loginService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user };
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