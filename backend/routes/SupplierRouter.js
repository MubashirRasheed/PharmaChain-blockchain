import express from 'express';

import { AddNewSupplier, GetAllSuppliers, DeleteSupplier
, UpdateSupplier } from "../controllers/SupplierController.js";

let SupplierRouter = express.Router();

SupplierRouter.post("/addNewSupplier", AddNewSupplier);

SupplierRouter.get("/allSuppliers", GetAllSuppliers);

SupplierRouter.delete("/deteleSupplier/:id", DeleteSupplier);

SupplierRouter.put("/updateSupplier/:id", UpdateSupplier);


export default SupplierRouter;