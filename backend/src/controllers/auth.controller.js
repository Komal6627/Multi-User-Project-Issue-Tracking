import { registerService, loginService, refreshTokenService, logoutService } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error); // pass error to centralized error middleware
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await loginService(req.body.email, req.body.password);

    // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15*60*1000 });
    res.json({ success: true, accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await refreshTokenService(token);

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: false });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutService(req.user.id);
    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};