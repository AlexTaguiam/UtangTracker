import express from "express";
import router from "./routes/routes.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
