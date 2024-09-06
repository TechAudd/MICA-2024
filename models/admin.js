import mongoose from "mongoose";

mongoose.Promise = global.Promise;

// EID, NAME, EMAIL, PASSWORD, TYPE;
const adminSchema = new mongoose.Schema({
  userName:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export { Admin };


  // NAME: {
  //   type: "String",
  //   required: true,
  // },
  // EMAIL: {
  //   type: "String",
  //   required: true,
  // },
  // TYPE: {
  //   type: "String",
  //   required: true,
  // },