import express from "express";
import {
  addCustomer,
  deleteCustomer,
  deleteUtang,
  getAllCustomers,
  getDashboard,
  getSingleCustomer,
  utangPayment,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/dashboard", getDashboard);

router.get("/customers", getAllCustomers);
router.get("/customers/:customerId", getSingleCustomer);
router.post("/customers", addCustomer);

router.put("/customers/:customerId/utang/:utangId/details", utangPayment);
router.delete("/customers/:customerId/utang/:utangId", deleteUtang);

router.delete("/customers/:customerId", deleteCustomer);

export default router;
