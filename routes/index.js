import express from "express";
import { adminLogin, adminRegister} from "../controllers/admin.js";
import {
  addRegister,
  updateRegister,
  updateWithTxnid,
  getRegister,
  getAllRegisters,
  getRegistrationCounts,
  sendMailtoAll,
  uploadZip
} from "../controllers/form.js";
import {
  addPrices,
  updatePrices,
  getPrices,
  getPricesAdmin,
  getConversionRate,
} from "../controllers/price.js";

import { registersCount, registersRevenue } from "../controllers/statistics.js";

const router = express.Router();

//Admin Login routes
router.post("/admin-login", adminLogin);
router.post("/admin-register", adminRegister);

//Register routes
router.post("/addRegister", addRegister);
router.patch("/updateRegister/:id", updateRegister);
router.put("/updateWithTxnid/:txnid", updateWithTxnid);
router.get("/getRegister/:id", getRegister);
router.get("/getAllRegisters", getAllRegisters);
router.get("/getRegistrationCounts", getRegistrationCounts);
router.post("/uploadZip", uploadZip);

//Prices routes
router.post("/addPrices", addPrices);
router.patch("/updatePrices", updatePrices);
router.get("/getPrices", getPrices);
router.get("/getPricesAdmin", getPricesAdmin);

router.get("/registersCount", registersCount);
router.get("/registersRevenue", registersRevenue);

router.get("/getConversionRate", getConversionRate);

router.put("/sendMailtoAll", sendMailtoAll);


export default router;
