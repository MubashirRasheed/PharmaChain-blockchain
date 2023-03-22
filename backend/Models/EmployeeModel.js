import mongoose from "mongoose";


const employeeSchema = new mongoose.Schema({
  UserID: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  HireDate: {
    type: String,
    // required: true
  },
  Country: {
    type: String,
    // required: true
  },
  ReportsTo: {
    type: String,
    // required: true
  },
  UserImageUrl: {
    type: String,
    // required: true
  }
}, { timestamps: true });

export default  mongoose.model('Employees', employeeSchema);
