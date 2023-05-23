import express from 'express';

import { AddNewManufacturer, GetAllManufacturers, DeleteManufacturer
, UpdateManufacturer } from "../Controllers/ManufacturerController.js";

let ManufacturerRouter = express.Router();

ManufacturerRouter.post("/addNewManufacturer", AddNewManufacturer);

ManufacturerRouter.get("/allManufacturers", GetAllManufacturers);

ManufacturerRouter.delete("/deteleManufacturer/:id", DeleteManufacturer);

ManufacturerRouter.put("/updateManufacturer/:id", UpdateManufacturer);


export default ManufacturerRouter;