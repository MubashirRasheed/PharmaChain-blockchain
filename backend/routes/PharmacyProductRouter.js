import express from 'express';

import { AddNewPharmacyProduct, GetAllPharmacyProducts, DeletePharmacyProduct
, UpdatePharmacyProduct } from "../controllers/PharmacyProductController.js";

let PharmacyProductRouter = express.Router();

PharmacyProductRouter.post("/addNewPharmacyProduct", AddNewPharmacyProduct);

PharmacyProductRouter.get("/allPharmacyProducts", GetAllPharmacyProducts);

PharmacyProductRouter.delete("/detelePharmacyProduct/:id", DeletePharmacyProduct);

PharmacyProductRouter.put("/updatePharmacyProduct/:id", UpdatePharmacyProduct);


export default PharmacyProductRouter;