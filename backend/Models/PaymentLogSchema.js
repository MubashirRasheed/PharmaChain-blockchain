import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PaymentLogSchema = new Schema({
    PaymentLogID: {
        type: Number,
    },
    TotalAmount: {
        type: Number,
    },
    TotalProducts: {
        type: String,
    },
    QuantityByProduct: {
        type: String,
    },

}, { timestamps: true });

const PaymentLog = mongoose.model('paymentlog', PaymentLogSchema);

export default PaymentLog;

