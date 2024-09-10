import express from "express";
import { initiate_payment } from "../Easebuzz/initiate_payment.js";
import dotenv from "dotenv";
import sha512 from "js-sha512";
import Payment from "../models/payment.js";
import Form from "../models/form.js";
import { Price } from "../models/price.js";
import moment from "moment-timezone";

dotenv.config();
const router = express.Router();

const config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};

const GST = 0; // GST percentage
const getPlatFormFee = (currency) => {
  // platform fee is now being calculated by payment-gateway so this funciton is now return 0 for any currency
  return currency === "INR" ? 0 : 0;
};

router.post("/initiate_payment", function (req, res) {
  let data = req.body;
  initiate_payment(data, config, res);
});

router.post("/response", async function (req, res) {
  function checkReverseHash(response) {
    var hashstring =
      config.salt +
      "|" +
      response.status +
      "|" +
      response.udf10 +
      "|" +
      response.udf9 +
      "|" +
      response.udf8 +
      "|" +
      response.udf7 +
      "|" +
      response.udf6 +
      "|" +
      response.udf5 +
      "|" +
      response.udf4 +
      "|" +
      response.udf3 +
      "|" +
      response.udf2 +
      "|" +
      response.udf1 +
      "|" +
      response.email +
      "|" +
      response.firstname +
      "|" +
      response.productinfo +
      "|" +
      response.amount +
      "|" +
      response.txnid +
      "|" +
      response.key;
    let hash_key = sha512.sha512(hashstring);
    if (hash_key == req.body.hash) return true;
    else return false;
  }
  if (checkReverseHash(req.body)) {
    if (req.body.status === "success") {
      const paymentDetails = {
        txnid: req.body.txnid,
        easepayid: req.body.easepayid,
        bank_ref_num: req.body.bank_ref_num,
        status: req.body.status,
        net_amount_debit: req.body.net_amount_debit,
        cardCategory: req.body.cardCategory,
        phone: req.body.phone,
        cardnum: req.body.cardnum,
        upi_va: req.body.upi_va,
        card_type: req.body.card_type,
        mode: req.body.mode,
      };

      try {
        const payment = new Payment(paymentDetails);
        await payment.save();

        // const formDetails = {
        //   ...req.body.formDetails,
        //   tnxid: req.body.txnid,
        // };
        // const formDetails = {
        //   tnxid: req.body.txnid,
        //   registerType: "Paper Author",  // Example value
        //   name: "John Doe",  // Example value
        //   phone: "1234567890",  // Example value
        //   mailId: "john.doe@example.com",  // Example value
        //   affiliation: "University X",  // Example value
        //   paperTitle: "Sample Paper Title",  // Example value
        //   paperId: "12345",  // Example value
        //   occupation: "Faculty",  // Example value
        //   member: "IEEE member",  // Example value
        //   membershipId: "IEEE123456",  // Example value
        //   pages: "10",  // Example value
        //   price: "100",  // Example value
        // };

        // const form = new Form(formDetails);
        // await form.save();

        const url = process.env.FRONTEND_URL + `/${payment.txnid}/success`;
        return res.redirect(url);
      } catch (error) {
        console.error("Error saving payment:", error);
        return res.status(500).send("Internal Server Error");
      }
    } else {
      const url = process.env.FRONTEND_URL + "/failed";
      return res.redirect(url);
    }
  } else {
    return res.send("false, check the hash value");
  }
});

export async function calculateAmount(data) {
  const {
    currency,
    registerType,
    occupation,
    member,
    numberOfPages,
    extraPages,
  } = data;
  // Determine the type based on the current date
  const today = new Date();
  const EarlyBirdDate = "2024-09-50";
  const earlyBirdEndDate = moment
    .tz(`${EarlyBirdDate}T23:59:59+05:30`, "Asia/Kolkata")
    .toDate();
  const priceType = today <= earlyBirdEndDate ? "Early Bird" : "Normal";
  // Determine the title based on registerType and occupation
  let title;
  if (registerType === "Listener") {
    title = "Listener";
  } else if (registerType === "Doctoral Consortium") {
    title = "Doctoral Consortium";
  } else if (occupation === "Student") {
    title = "Student";
  } else if (occupation === "Faculty") {
    title = "Faculty";
  } else if (occupation === "Industry Expert") {
    title = "Industry Expert";
  } else if (occupation === "Student Additional Registration") {
    title = "Student Additional Registration";
  } else {
    title = "Officials";
  }
  // Determine member type
  let memberType;
  if (member === "IEEE member") {
    memberType = "IEEE";
  } else if (member === "non-IEEE member") {
    memberType = "Non-IEEE";
  } else if (member === "IES member") {
    memberType = "IES";
  } else {
    memberType = "None";
  }
  // Fetch the price from the database
  const price = await Price.findOne({
    type: priceType,
    title: title,
    member: memberType,
  });
  if (!price) {
    throw new Error("Price not found");
  }

  // Calculate the base amount based on the currency
  let baseAmount =
    currency === "INR" ? parseFloat(price.INR) : parseFloat(price.USD);

  // Add extra page charges if applicable (excluding Listener and Doctoral Consortium)
  if (
    numberOfPages === "MoreThan10" &&
    registerType !== "Listener" &&
    registerType !== "Doctoral Consortium"
  ) {
    const extraPageCharges = extraPages * (currency === "INR" ? 1000 : 35);
    baseAmount += extraPageCharges;
  }

  // Calculate GST (18%)
  const gst = baseAmount * (GST / 100);
  let amountWithGst = baseAmount + gst;

  // Add platform fee
  // const platformFee = currency === "INR" ? 7 : 1;
  const platformFee = amountWithGst * (getPlatFormFee(currency) / 100);
  const platformFeeWithSymbol =
    currency === "INR"
      ? `₹${platformFee.toFixed(2)}`
      : `$${platformFee.toFixed(2)}`;
  const totalAmount = amountWithGst + platformFee;

  // Round off the total amount
  const roundedAmount = totalAmount.toFixed(2);

  return {
    baseAmount: baseAmount,
    gst: GST + "%",
    amountWithGst: amountWithGst,
    platformFee: getPlatFormFee(currency) + "% (" + platformFeeWithSymbol + ")",
    netAmount: roundedAmount,
  };
}

router.post("/verify-amount", async (req, res) => {
  try {
    const {
      currency,
      registerType,
      occupation,
      member,
      numberOfPages,
      extraPages,
      amount,
    } = req.body;
    const calculatedAmount = await calculateAmount({
      currency,
      registerType,
      occupation,
      member,
      numberOfPages,
      extraPages,
    });

    // Verify if the calculated amount matches the provided amount
    if (calculatedAmount.netAmount !== parseFloat(amount).toFixed(2)) {
      return res.status(400).json({ message: "Amount mismatch" });
    }

    res.json({ message: "Amount verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/calculate-amount", async (req, res) => {
  try {
    const data = req.body;
    const calculatedAmountData = await calculateAmount(data);
    res.json({ calculatedAmountData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
