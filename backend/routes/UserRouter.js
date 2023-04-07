// const express = require("express");
import express from "express";
// const AdminModel = require("../Models/UserModel");
// imoprt AdminModel from "../Models/AdminModel";
// const UserController = require("../Controllers/UserController");
// import UserController from "../Controllers/UserController";
import {register, login, updateProfile} from "../Controllers/UserController.js";


let UserRouter = express.Router();

UserRouter.post("/register", register);

UserRouter.post("/login", login);

UserRouter.post("/updateProfile/:id", updateProfile);



// UserRouter.delete("/delete/:id", UserController.DeleteUser);

// UserRouter.put("/update/:id", UserController.UpdateUser);

// router.get("/GeneralCampigns/:id", UserController.ViewGeneralCampaigns);

export default UserRouter;
