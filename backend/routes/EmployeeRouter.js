import express from 'express';

import { AddNewEmployee, GetAllEmployees, DeleteEmployee
, UpdateEmployee } from "../controllers/EmployeeController.js";

let EmployeeRouter = express.Router();

EmployeeRouter.post("/addNewEmployee", AddNewEmployee);

EmployeeRouter.get("/allEmployees", GetAllEmployees);

EmployeeRouter.delete("/deteleEmployee/:id", DeleteEmployee);

EmployeeRouter.put("/updateEmployee/:id", UpdateEmployee);


export default EmployeeRouter;