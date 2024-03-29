// const UserModel = require("../models/UserModel");

// // Crud Operations
// const GetUser = async (req, res, next) => {
//   try {
//     UserModel.find({ email: req.body.email }).exec(function (error, data) {
//       if (error) {
//         return next(error);
//       } else {
//         if (req.body.password === data.password) {
//           res.send("Access Granted");
//         } else {
//           res.send("Unauthorized Access");
//         }
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// const GetAllUsers = async (req, res, next) => {
//   console.log(req.body);
//   UserModel.find({}).exec(function (error, data) {
//     if (error) {
//       return next(error);
//     }
//     res.json(data);
//   });
// };

// const AddNewUser = async (req, res, next) => {
//   try {
//     console.log("Got a request for creating a new User");
//     console.log(req.body);
//     let user = await UserModel.findOne({
//       email: req.body.email,
//     }).exec();
//     console.log(user);
//     if (user) {
//       res.send("User Already Exists");
//     } else {
//       console.log(
//         "User for given credentials deos not exist! Creating User Now!!"
//       );
//       UserModel.create(req.body)
//         .then(function (data) {
//           console.log(data);
//           res.status(200);
//           res.json(data);
//         })
//         .catch((err) => {
//           console.log(err);
//           res.send(err.message);
//         });
//     }
//     res.send("i came here!");
//   } catch (error) {
//     console.log("Error encountered: ", error.message);
//     next(error);
//   }
// };

// const UpdateUser = async (req, res, next) => {
//   await UserModel.findByIdAndUpdate(req.params.id, {
//     name: req.body.name,
//     email: req.body.email,
//     age: req.body.age,
//     password: req.body.password,
//     contact: req.body.contact,
//   });
//   let newUser = await UserModel.findById(req.params.id);
//   res.json(newUser);
// };

// const DeleteUser = async (req, res, next) => {
//   UserModel.deleteOne({ _id: req.params.id }).exec(function (error, data) {
//     if (error) {
//       next(error);
//     }
//     res.json(data);
//   });
// };

// const ChangeDetails = async (req, res, next) => {
//   await UserModel.findByIdAndUpdate(req.params.id, {
//     name: req.body.name,
//     email: req.body.email,
//     age: req.body.age,
//     password: req.body.password,
//     contact: req.body.contact,
//   });
//   let newUser = await UserModel.findById(req.params.id);
//   res.json(newUser);
// };

// module.exports = {
//   AddNewUser,
//   UpdateUser,
//   GetUser,
//   GetAllUsers,
//   ChangeDetails,
//   DeleteUser,
// };


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User, Job} from '../models/UserModel.js';

// REGISTER USER

export const register = async (req, res) => {
  try {

    const { fullname, location, license, ethAddress, email, password,chatId, picturePath, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      location,
      license,
      ethAddress,
      email: email.toLowerCase(),
      password: passwordHash,
      chatId,
      picturePath,
      role,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // make sure to not send the password back to the user in frontend
    delete user.password;
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { fullname, location, ethAddress, picturePath, password,email } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.fullname = fullname;
    user.location = location;
    user.ethAddress = ethAddress;
    user.picturePath = picturePath;
    user.email = email;
    user.password = passwordHash;
    user.chatId = password;

    await user.save();

    // make sure to not send the password back to the user in frontend
    delete user.password;
    const {  ...updatedUser } = user.toObject();

    res.json(updatedUser);

    res.status(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
