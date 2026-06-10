import mongoose, { models, Schema } from "mongoose";

const UserSchema = new Schema({
  userId: {
    // owner userId or uId
    type: String,
    require: true,
  },
  type: {
    // debit or credit
    type: String,
    require: true,
  },
  amount: {
    // amount of transaction
    type: Number,
    require: true,
  },
  category: {
    // category of transaction
    type: String,
    require: true,
  },
  createAt: {
    // transaction date and time
    type: String,
    require: true,
  },
  note: {
    // optional description for spending amount
    type: String,
    require: false,
  },
  merchant: {
    // merchant or source of transaction
    type: String,
    require: true,
  },
});

const Transcation =
  models.Transcation || mongoose.model("Transcation", UserSchema);
export default Transcation;
