import request from "request";
import sha512 from "js-sha512";

export const curl_call = (url, data, method = "POST") => {
  const options = {
    method: method,
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: data,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response) => {
      if (response) {
        const data = JSON.parse(response.body);
        return resolve(data);
      } else {
        return reject(error);
      }
    });
  });
};

export const validate_email = (mail) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

export const validate_phone = (number) => {
  return number.length !== 10;
};

export const generateHash = (data, config) => {
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

export const validate_float = (number) => {
  return parseFloat(number) === number;
};

export const get_query_url = (env) => {
  let url_link = "";
  if (env === "prod") {
    url_link = "https://dashboard.easebuzz.in/";
  }
  return url_link;
};
