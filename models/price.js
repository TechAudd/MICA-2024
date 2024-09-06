import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const priceSchema = new mongoose.Schema({
  type: {
    type: "String",
    enum: ["Normal", "Early Bird"],
    required: true,
  },
  title: {
    type: "String",
    enum: ["Officials", "Student", "Attendee", "Doctoral Consortium", "Student Additional Registration"],
    required: true,
  },
  member: {
    type: "String",
    enum: ["IEEE", "Non-IEEE", "IES"],
    required: true,
  },
  INR: {
    type: "String",
    required: true,
  },
  USD: {
    type: "String",
    required: true,
  }
});

const Price = mongoose.model("Price", priceSchema);

export { Price };