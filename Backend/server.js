import express from "express";
import router from "./routes/routes.js";

const app = express();
const PORT = 3000;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
