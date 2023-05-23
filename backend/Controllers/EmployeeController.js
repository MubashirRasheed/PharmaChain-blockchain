import EmployeeModel from "../models/EmployeeModel.js";

// Get all employees
export const GetAllEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find({});
    res.json(employees);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get an employee by id
export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Create a new employee
export const AddNewEmployee = async (req, res, next) => {
  try {
    const newEmployee = new EmployeeModel({
      UserID: req.body.UserID,
      Name: req.body.Name,
      Title: req.body.Title,
      HireDate: req.body.HireDate,
      Country: req.body.Country,
      ReportsTo: req.body.ReportsTo,
      UserImageUrl: req.body.UserImageUrl,
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Update an existing employee
export const UpdateEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Delete an employee by id
export const DeleteEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
