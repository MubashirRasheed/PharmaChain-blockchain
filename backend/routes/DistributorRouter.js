import express from 'express';

import { AddNewDistributor, GetAllDistributors, DeleteDistributor
, UpdateDistributor } from "../controllers/DistributorController.js";

let DistributorRouter = express.Router();

DistributorRouter.post("/addNewDistributor", AddNewDistributor);

DistributorRouter.get("/allDistributors", GetAllDistributors);

DistributorRouter.delete("/deteleDistributor/:id", DeleteDistributor);

DistributorRouter.put("/updateDistributor/:id", UpdateDistributor);


export default DistributorRouter;