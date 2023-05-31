import mongoose from "mongoose";

const PaymentLogSchema = new mongoose.Schema({
    PaymentLogID: {
      type: Number,
    },
    TotalAmount: {
      type: Number,
    },
    TotalProducts: {
      type: String,
    },
    QuantityByProduct:
      {
        name: {
          type: String,
        },
        quantity: {
          type: Number,
        },
      },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    __v: {
      type: Number,
    },

}, { timestamps: true });

const PaymentLog = mongoose.model('paymentlog', PaymentLogSchema);

export default PaymentLog;
