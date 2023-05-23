import CustomerModel from '../models/CustomersModel.js';

// Get a customer by ID
export const GetCustomer = async (req, res, next) => {
  try {
    CustomerModel.find({ CustomerID: req.params.id }).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Get all customers
export const GetAllCustomers = async (req, res, next) => {
  try {
    CustomerModel.find({}).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Add a new customer
export const AddNewCustomer = async (req, res) => {
  try {
    const newCustomer = new CustomerModel({
      CustomerID: req.body.CustomerID,
      CustomerName: req.body.CustomerName,
      CustomerEmail: req.body.CustomerEmail,
      CustomerUrl: req.body.CustomerUrl,
      ProjectName: req.body.ProjectName,
      Status: req.body.Status,
      StatusBg: req.body.StatusBg,
      Weeks: req.body.Weeks,
      Budget: req.body.Budget,
      Location: req.body.Location,
    });

    const savedCustomer = await newCustomer.save(); // Save the new customer to the database

    res.status(201).json(savedCustomer); // Return the saved customer as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};

// Update an existing customer
export const UpdateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      CustomerID,
      CustomerName,
      CustomerEmail,
      CustomerUrl,
      ProjectName,
      Status,
      StatusBg,
      Weeks,
      Budget,
      Location,
    } = req.body;

    const customer = await CustomerModel.findByIdAndUpdate(
      id,
      {
        CustomerID,
        CustomerName,
        CustomerEmail,
        CustomerUrl,
        ProjectName,
        Status,
        StatusBg,
        Weeks,
        Budget,
        Location,
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).send({ message: 'Customer not found' });
    }

    res.status(200).send({ customer });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Delete a customer by ID
export const DeleteCustomer = async (req, res) => {
  try {
    const { CustomerID } = req.params;
    const deletedCustomer = await CustomerModel.findOneAndDelete({ CustomerID });
    if (!deletedCustomer) {
      return res.status(404).send({ message: 'Customer not found' });
    }
    return res.status(200).send({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};
