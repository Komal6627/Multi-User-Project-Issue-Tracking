import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import organizationRoute from "./routes/organization.routes.js";
import projectRoute from "./routes/project.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js";



const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoute);
app.use("/api/project", projectRoute);

// Error Handler
app.use(errorHandler);

export default app;