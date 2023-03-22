import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContractSchema = new Schema({
  ContractID: {
    type: String,
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
    required: true
  }
}, { timestamps: true });

export default  mongoose.model('Contracts', ContractSchema);
