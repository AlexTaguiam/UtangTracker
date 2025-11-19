import express from "express";
import router from "./routes/routes.js";
import { connectDB } from "./config/db.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(apiLimiter);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use("/api", router);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
