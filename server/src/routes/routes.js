import express from "express";
import {
  addCustomer,
  deleteCustomer,
  deleteUtang,
  getAllCustomers,
  getDashboard,
  getSingleCustomer,
  utangPayment,
  getSpecificTransaction,
  getAllCustomersUtang,
} from "../controllers/controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/dashboard", getDashboard);
router.get("/transaction/:customerId/:historyId", getSpecificTransaction);
router.get("/allCustomersUtang", getAllCustomersUtang);

router.get("/customers", getAllCustomers);
router.get("/customers/:customerId", getSingleCustomer);
router.post("/customers", addCustomer);

router.put("/customers/:customerId/utang/:utangId/details", utangPayment);
router.delete("/customers/:customerId/utang/:utangId", deleteUtang);

router.delete("/customers/:customerId", deleteCustomer);

export default router;
