import express from "express";
import router from "./routes/routes.js";
import authRouter from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

//CORS configurations
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

//Middleware
app.use(apiLimiter);

//Routes
app.use("/api", router);
app.use("/api", authRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

connectDB().then(() => {
  app.listen(
    (process.env.PORT || 5000,
    () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    }),
  );
});
