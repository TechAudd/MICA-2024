import mongoose from "mongoose";

const { Schema } = mongoose;

const conversionSchema = new Schema(
  {
    USDToINR: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("USDToINR", conversionSchema);
