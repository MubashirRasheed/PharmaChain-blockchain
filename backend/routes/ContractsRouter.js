import express from 'express';

import { AddNewContract, GetAllContracts, DeleteContract
, UpdateContract } from "../Controllers/ContractsController.js";

let ContractsRouter = express.Router();

ContractsRouter.post("/addNewContracts", AddNewContract);

ContractsRouter.get("/allContracts", GetAllContracts);

ContractsRouter.delete("/deteleContracts/:id", DeleteContract);

ContractsRouter.put("/updateContracts/:id", UpdateContract);


export default ContractsRouter;