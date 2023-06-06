import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  OrderID: {
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
    required: true
  },
  Status: {
    type: String,
    required: true
  },
  StatusBg: {
    type: String,
    required: true
  },
  ProductImageUrl: {
    type: String,
    required: true
  }
}, 
{
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
