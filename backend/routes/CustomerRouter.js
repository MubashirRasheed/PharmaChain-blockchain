import express from 'express';

import { AddNewCustomer, GetAllCustomers, DeleteCustomer
, UpdateCustomer } from "../Controllers/CustomerController.js";

let CustomerRouter = express.Router();

CustomerRouter.post("/addNewCustomer", AddNewCustomer);

CustomerRouter.get("/allCustomers", GetAllCustomers);

CustomerRouter.delete("/deteleCustomer/:id", DeleteCustomer);

CustomerRouter.put("/updateCustomer/:id", UpdateCustomer);


export default CustomerRouter;