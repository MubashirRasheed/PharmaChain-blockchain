import express from "express";

import { AddNewPaymentLog, GetAllPaymentLogs, DeletePaymentLog
    , UpdatePaymentLog } from "../Controllers/PaymentLogController.js";

let PaymentLogRouter = express.Router();

PaymentLogRouter.post("/addNewPaymentLog", AddNewPaymentLog);

PaymentLogRouter.get("/allPaymentLogs", GetAllPaymentLogs);

PaymentLogRouter.delete("/detelePaymentLog/:id", DeletePaymentLog);

PaymentLogRouter.put("/updatePaymentLog/:id", UpdatePaymentLog);

export default PaymentLogRouter;