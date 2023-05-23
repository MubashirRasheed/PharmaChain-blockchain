import express from 'express';

import { AddNewTask, GetAllTasks, DeleteTask
, UpdateTask } from "../Controllers/KanbanController.js";

let KanbanRouter = express.Router();

KanbanRouter.post("/addNewTask", AddNewTask);

KanbanRouter.get("/allTasks", GetAllTasks);

KanbanRouter.delete("/deteleTask/:id", DeleteTask);

KanbanRouter.put("/updateTask/:id", UpdateTask);


export default KanbanRouter;