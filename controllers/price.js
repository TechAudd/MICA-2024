import { Price } from "../models/price.js";
import { sse } from "../routes/SSE/sseRoutes.js";
import moment from "moment-timezone";
import conversion from "../models/conversion.js";

export const addPrices = async (req, res) => {
  try {
    const priceData = req.body;

    // Check if bookingsData is an array
    if (!Array.isArray(priceData)) {
      return res
        .status(400)
        .json({ message: "price data must be provided as an array" });
    }
    // Create multiple bookings
    const createdPrices = await Price.create(priceData);
    sse.send(createdPrices, "Added prices");
    res.status(201).json({ message: "prices added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePrices = async (req, res) => {
  try {
    const updates = req.body;

    // Check if updates is an array
    if (!Array.isArray(updates)) {
      return res
        .status(400)
        .json({ message: "Updates must be provided as an array" });
    }

    // Update multiple bookings
    const updatedPrices = [];
    for (const update of updates) {
      const { id, ...fieldsToUpdate } = update;

      // Find the booking by id and update the specified fields
      const updatedPrice = await Price.findByIdAndUpdate(id, fieldsToUpdate, {
        new: true,
      });

      updatedPrices.push(updatedPrice);
    }
    sse.send(updatedPrices, "Updated Pricess");
    res.json(updatedPrices);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPricesAdmin = async (req, res) => {
  try {
    // Find all form entries matching the query
    const { type, title, member } = req.query;
    let query = {};
    if (type) {
      query.type = type;
    }
    if (title) {
      query.title = title;
    }
    if (member) {
      query.member = member;
    }
    const prices = await Price.find(query);
    sse.send(prices, "Get Pricess");
    res.status(200).json(prices);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPrices = async (req, res) => {
  try {
    // Determine the pricing type based on the current date
    const today = moment().tz("Asia/Kolkata");
    const pricingType = today.isBefore(moment("2024-07-10").tz("Asia/Kolkata"))
      ? "Early Bird"
      : "Normal";

    // Fetch prices from the database based on the pricing type
    const prices = await Price.find({ type: pricingType });

    // Initialize the structured response object
    const response = {
      Normal: {
        Officials: {
          IEEE: [],
          NonIEEE: [],
        },
        Student: {
          IEEE: [],
          NonIEEE: [],
        },
        Listener: [],
      },
    };

    // Populate the response object with the fetched prices
    prices.forEach((price) => {
      if (price.title === "Officials") {
        if (price.member === "IEEE") {
          response.Normal.Officials.IEEE.push({
            INR: price.INR,
            USD: price.USD,
          });
        } else if (price.member === "Non-IEEE") {
          response.Normal.Officials.NonIEEE.push({
            INR: price.INR,
            USD: price.USD,
          });
        }
      } else if (price.title === "Student") {
        if (price.member === "IEEE") {
          response.Normal.Student.IEEE.push({
            INR: price.INR,
            USD: price.USD,
          });
        } else if (price.member === "Non-IEEE") {
          response.Normal.Student.NonIEEE.push({
            INR: price.INR,
            USD: price.USD,
          });
        }
      } else if (price.title === "Listener") {
        response.Normal.Listener.push({
          INR: price.INR,
          USD: price.USD,
        });
      }
    });

    // Send the structured response
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getConversionRate = async (req, res) => {
  try {
    const response = await conversion.findOne().sort({ createdAt: -1 });
    if (!response) {
      throw new Error("No conversion rate found in the database.");
    }
    const rate = response.USDToINR;
    res.send({ conversionRate: rate }).status(200);
  } catch (error) {
    res.send(error).status(500);
  }
};
