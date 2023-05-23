import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  CustomerID: {
    type: Number,
    required: true
  },
  CustomerName: {
    type: String,
    required: true
  },
  CustomerEmail: {
    type: String,
    required: true
  },
  CustomerUrl: {
    type: String,
  },
  ProjectName: {
    type: String,
  },
  Status: {
    type: String,
  },
  StatusBg: {
    type: String,
  },
  Weeks: {
    type: String,
  },
  Budget: {
    type: String,
  },
  Location: {
    type: String,
  }
}, { timestamps: true });

export default  mongoose.model('Customers', customerSchema);
