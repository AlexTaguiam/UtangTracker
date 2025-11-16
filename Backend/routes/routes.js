import express from "express";

const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.status(200).send("Dashboard Loaded succesfully");
});

router.get("/customers", (req, res) => {
  res.status(200).send("Customers loaded successfully");
});

router.get("/customers/:id", (req, res) => {
  res.status(200).send("customers  details");
});

router.post("/customers", (req, res) => {
  res.status(201).send("New customer added succesfully");
});

router.put("/customers/:id", (req, res) => {
  res.status(200).send("edit customer added succesfully");
});

router.delete("/api/customers/:id", (req, res) => {
  res.status(200).send("customer deleted succesfully");
});

export default router;
