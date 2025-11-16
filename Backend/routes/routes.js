import express from "express";
import {
  addCustomer,
  deleteCustomer,
  editCustomer,
  getAllCustomers,
  getCustomer,
  getDashboard,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/dashboard", getDashboard);

router.get("/customers", getAllCustomers);

router.get("/customers/:id", getCustomer);

router.post("/customers", addCustomer);

router.put("/customers/:id", editCustomer);

router.delete("/api/customers/:id", deleteCustomer);

export default router;
