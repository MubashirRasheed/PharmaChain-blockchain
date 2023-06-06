// const express = require("express");
import express from "express";
// const AdminModel = require("../models/UserModel");
// imoprt AdminModel from "../models/AdminModel";
// const UserController = require("../controllers/UserController");
// import UserController from "../controllers/UserController";
import {register, login, updateProfile} from "../controllers/UserController.js";


let UserRouter = express.Router();

UserRouter.post("/register", register);

UserRouter.post("/login", login);

UserRouter.post("/updateProfile/:id", updateProfile);



// UserRouter.delete("/delete/:id", UserController.DeleteUser);

// UserRouter.put("/update/:id", UserController.UpdateUser);

// router.get("/GeneralCampigns/:id", UserController.ViewGeneralCampaigns);

export default UserRouter;
