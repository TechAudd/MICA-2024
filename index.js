import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import axios from "axios";
import cron from "node-cron";

import MainRoutes from "./routes/index.js";
import PaymentRoutes from "./routes/payment.js";

import conversionSchema from "./models/conversion.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/form", MainRoutes);
app.use("/", PaymentRoutes);

// Example route
app.get("/api/test", async (req, res) => {
  res.json({ message: "Hello from express" });
});

const addOrUpdateCurrency = async () => {
  try {
    const response = await axios.get(
      "https://anyapi.io/api/v1/exchange/convert",
      {
        params: {
          amount: 140,
          apiKey: "7cuqt30hs58c35v4vi94v8fkqqgjc7maornkhv01eiqg04p76gut56g",
          base: "USD",
          to: "INR",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making API call:", error);
  }
};

const makeApiCall = async () => {
  try {
    const response = await addOrUpdateCurrency();
    console.log(response);
    const rate = response.rate;
    const converted = new conversionSchema({ USDToINR: rate.toString() });
    await converted.save();
  } catch (error) {
    console.error("Error making API call:", error);
  }
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      cron.schedule("0 0,8,16 * * *", () => {
        console.log("Running the API call job...");
        makeApiCall();
      });
      // cron.schedule("0 14 16 15 7 1", () => {
      //   makeApiCall();
      // });
      // makeApiCall();
      console.log(
        `Server Started at PORT - ${process.env.PORT}, Connection to Database Done`
      );
    });
  })
  .catch((error) => {
    console.log(`Error Connecting to Database : ${error}`);
  });
