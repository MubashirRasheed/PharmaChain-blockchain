import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain the word: "password"');
        }
      },
    },
    role: {
      type: String,
      enum: ['admin', 'rawMaterialSupplier', 'manufacturer', 'transporter', 'distributor', 'pharmacist'],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    ethAddress: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

// module.exports = User;
export default User;