import express from "express";
const app = express();
const PORT = 3000;

app.get("/api/dashboard", (req, res) => {
  res.status(200).send("Dashboard Loaded succesfully");
});

app.get("/api/customers", (req, res) => {
  res.status(200).send("Customers loaded successfully");
});

app.get("/api/customers/:id", (req, res) => {
  res.status(200).send("customers  details");
});

app.post("/api/add", (req, res) => {
  res.status(201).send("New customer added succesfully");
});

app.put("/api/customers/:id", (req, res) => {
  res.status(200).send("edit customer added succesfully");
});

app.delete("/api/customers/:id", (req, res) => {
  res.status(200).send("customer deleted succesfully");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
