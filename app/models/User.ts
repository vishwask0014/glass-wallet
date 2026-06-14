import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    region: {
      type: String,
      default: "",
    },

    planningStyle: {
      type: String,
      default: "",
    },

    monthlySalary: {
      type: Number,
      default: null,
    },

    salaryUpdatedAt: {
      type: Date,
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || mongoose.model("User", UserSchema);

export default User;
