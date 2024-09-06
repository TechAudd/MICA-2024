import { curl_call, validate_email, validate_phone } from "./util.js";
import sha512 from "js-sha512";

export const initiate_payment = (data, config, res) => {
  try {
    const isFloat = (amt) => {
      const regexp = /^\d+\.\d{1,2}$/;
      return regexp.test(amt);
    };

    const checkArgumentValidation = (data, config) => {
      if (!data.name.trim()) {
        res.json({
          status: 0,
          data: "Mandatory Parameter name cannot be empty",
        });
        return false;
      }
      if (!isFloat(data.amount)) {
        res.json({
          status: 0,
          data: "Mandatory Parameter amount cannot be empty and must be in decimal",
        });
        return false;
      }
      if (!data.txnid.trim()) {
        res.json({
          status: 0,
          data: "Merchant Transaction validation failed. Please enter proper value for merchant txn",
        });
        return false;
      }
      if (!data.email.trim() || !validate_email(data.email)) {
        res.json({
          status: 0,
          data: "Email validation failed. Please enter proper value for email",
        });
        return false;
      }
      if (!data.phone.trim() || validate_phone(data.phone)) {
        res.json({
          status: 0,
          data: "Phone validation failed. Please enter proper value for phone",
        });
        return false;
      }
      if (!data.productinfo.trim()) {
        res.json({
          status: 0,
          data: "Mandatory Parameter Product info cannot be empty",
        });
        return false;
      }
      if (!data.surl.trim() || !data.furl.trim()) {
        res.json({
          status: 0,
          data: "Mandatory Parameter Surl/Furl cannot be empty",
        });
        return false;
      }
      return true;
    };

    const geturl = (env) => {
      let url_link = "";
      if (env === "test") {
        url_link = "https://testpay.easebuzz.in/";
      } else if (env === "prod") {
        url_link = "https://pay.easebuzz.in/";
      } else {
        url_link = "https://testpay.easebuzz.in/";
      }
      return url_link;
    };

    const form = () => {
      const form = {
        key: config.key,
        txnid: data.txnid,
        amount: data.amount,
        email: data.email,
        phone: data.phone,
        firstname: data.name,
        udf1: data.udf1,
        udf2: data.udf2,
        udf3: data.udf3,
        udf4: data.udf4,
        udf5: data.udf5,
        hash: hash_key,
        productinfo: data.productinfo,
        udf6: data.udf6,
        udf7: data.udf7,
        udf8: data.udf8,
        udf9: data.udf9,
        udf10: data.udf10,
        furl: data.furl,
        surl: data.surl,
      };
      if (data.unique_id) {
        form.unique_id = data.unique_id;
      }
      if (data.split_payments) {
        form.split_payments = data.split_payments;
      }
      if (data.sub_merchant_id) {
        form.sub_merchant_id = data.sub_merchant_id;
      }
      if (data.customer_authentication_id) {
        form.customer_authentication_id = data.customer_authentication_id;
      }
      return form;
    };

    const generateHash = () => {
      let hashstring =
        config.key +
        "|" +
        data.txnid +
        "|" +
        data.amount +
        "|" +
        data.productinfo +
        "|" +
        data.name +
        "|" +
        data.email +
        "|" +
        data.udf1 +
        "|" +
        data.udf2 +
        "|" +
        data.udf3 +
        "|" +
        data.udf4 +
        "|" +
        data.udf5 +
        "|" +
        data.udf6 +
        "|" +
        data.udf7 +
        "|" +
        data.udf8 +
        "|" +
        data.udf9 +
        "|" +
        data.udf10;
      hashstring += "|" + config.salt;
      data.hash = sha512(hashstring);
      return data.hash;
    };

    // Main calling part
    if (!checkArgumentValidation(data, config)) {
      return;
    }
    const hash_key = generateHash();
    const payment_url = geturl(config.env);
    const call_url = payment_url + "payment/initiateLink";
    curl_call(call_url, form()).then((response) => {
      pay(response.data, payment_url);
    });

    const pay = (access_key, url_main) => {
      console.log("triggereed");
      const url = url_main + "pay/" + access_key;
      console.log(url);
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      // return res.redirect(url);
      return res.json({ url }); // mine
    };
  } catch (error) {
    console.error("Error in initiate_payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
