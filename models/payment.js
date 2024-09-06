import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema(
    {
      txnid: {
        type: String,
        unique: true,
        required: true,
        },
      easepayid: {
        type: String,
        required: true,
      },
      bank_ref_num: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      net_amount_debit: {
        type: String,
        required: true,
      },
      cardCategory: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      cardnum: {
        type: String,
        required: true,
      },
      upi_va: {
        type: String,
        required: true,
      },
      card_type: {
        type: String,
        required: true,
      },
      mode:{
        type: String,
        required: true,
      }
    },
    { timestamps: true }
  );
  
  export default mongoose.model("Payment", paymentSchema);
  