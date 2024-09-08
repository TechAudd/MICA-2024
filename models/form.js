import mongoose from "mongoose";
import moment from 'moment';
const { Schema } = mongoose;

const formSchema = new Schema(
  {
    txnid: {
      type: String,
      unique: true,
      required: true,
    },
    registerType: {
      type: String,
      enum: ["Paper Author", "Doctoral Consortium", "Listener"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    mailId: {
      type: String,
      required: true,
    },
    affiliation: {
      type: String,
      required: true,
    },
    researchTitle: {
      type: String,
      default: "",
    },
    paperTitle: {
      type: String,
      default: "",
    },
    paperId: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      enum: ["Faculty", "Student", "Industry Expert"],
      required: true,
      // , "Student(Fully Registered)", "Student Additional Registration"
    },
    designation: {
      type: String,
      default: "",
    },
    member: {
      type: String,
      enum: ["IEEE member", "non-IEEE member", "IES member"],
    },
    membershipId: {
      type: String,
    },
    pages: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      enum: ["INR", "USD"],
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    payment: {
      type: Boolean,
      default: false,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    invoice: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.createdAt = moment(ret.createdAt).format("DD MMM YYYY");
        ret.updatedAt = moment(ret.updatedAt).format("DD MMM YYYY");
        return ret;
      },
    },
  }
);

export default mongoose.model("Form", formSchema);
