import express from "express";

import OrderController from "../Controllers/OrderController.js";

let router = express.Router();

router.post("/addNewOrder", OrderController.AddNewOrder);

router.get("/allOrders", OrderController.GetAllOrders);

router.delete("/deteleOrder/:id", OrderController.DeleteOrder);

router.put("/updateOrder/:id", OrderController.UpdateOrder);

export default router;