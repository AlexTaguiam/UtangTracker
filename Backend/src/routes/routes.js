import express from "express";
import {
  addCustomer,
  deleteCustomer,
  deleteUtang,
  getAllCustomers,
  getCustomer,
  getDashboard,
  updateUtangStatus,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/dashboard", getDashboard);

router.get("/customers", getAllCustomers);

router.get("/customers/:id", getCustomer);

router.post("/customers", addCustomer);

router.put("/customers/:customerId/utang/:utangId", updateUtangStatus);

router.delete("/customers/:id", deleteCustomer);

router.delete("/customers/:customerId/utang/:utangId", deleteUtang);

export default router;
