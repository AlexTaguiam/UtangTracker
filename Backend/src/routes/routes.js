import express from "express";
import {
  addCustomer,
  deleteCustomer,
  deleteUtang,
  getAllCustomers,
  getCustomer,
  getDashboard,
  updateUtangDetails,
  updateUtangStatus,
} from "../controllers/controller.js";

const router = express.Router();

router.get("/dashboard", getDashboard);

router.get("/customers", getAllCustomers);
router.get("/customers/:customerId", getCustomer);
router.post("/customers", addCustomer);

router.put("/customers/:customerId/utang/:utangId/status", updateUtangStatus);
router.put("/customers/:customerId/utang/:utangId/details", updateUtangDetails);
router.delete("/customers/:customerId/utang/:utangId", deleteUtang);

router.delete("/customers/:customer", deleteCustomer);

export default router;
