import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  MedicineID: {
    type: Number,
    required: true
  },
  CustomerName: {
    type: String,
    required: true
  },
  TotalAmount: {
    type: Number,
    required: true
  },
  OrderItems: {
    type: String,
    required: true
  },
  Location: {
    type: String,
    // required: true
  },
  Status: {
    type: String,
    required: true
  },
  StatusBg: {
    type: String,
    // required: true
  },
  ProductImageUrl: {
    type: String,
    // required: true
  }
}, { timestamps: true });

export default mongoose.model('Medicines', medicineSchema);
