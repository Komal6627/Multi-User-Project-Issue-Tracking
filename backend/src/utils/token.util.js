import jwt from "jsonwebtoken";



export const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      organization: user.organization
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};