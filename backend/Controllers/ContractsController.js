import ContractModel from "../models/ContractsModel.js";

// Async function to get a contract by its ContractID
export const GetContract = async (req, res, next) => {
  try {
    ContractModel.find({ ContractID: req.params.id }).exec(function (error, data) {
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

// Async function to get all contracts
export const GetAllContracts = async (req, res, next) => {
  try {
    ContractModel.find({}).exec(function (error, data) {
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

// Async function to add a new contract
export const AddNewContract = async (req, res) => {
  try {
    const newContract = new ContractModel({
      ContractID: req.body.ContractID,
      CustomerName: req.body.CustomerName,
      TotalAmount: req.body.TotalAmount,
      OrderItems: req.body.OrderItems,
      Location: req.body.Location,
      Status: req.body.Status,
      StatusBg: req.body.StatusBg,
      ProductImageUrl: req.body.ProductImageUrl,
    });

    const savedContract = await newContract.save(); // Save the new contract to the database

    res.status(201).json(savedContract); // Return the saved contract as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};

// Async function to update a contract by its ContractID
export const UpdateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { ContractID, CustomerName, TotalAmount, OrderItems, Location, Status, StatusBg, ProductImageUrl } = req.body;

    const contract = await ContractModel.findByIdAndUpdate(id, { 
      ContractID, 
      CustomerName, 
      TotalAmount, 
      OrderItems, 
      Location, 
      Status, 
      StatusBg, 
      ProductImageUrl 
    }, { new: true });

    if (!contract) {
      return res.status(404).send({ message: "Contract not found" });
    }

    res.status(200).send({ contract });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Async function to delete a contract by its ContractID
export const DeleteContract = async (req, res) => {
  try {
    const { ContractID } = req.params;
    const deletedContract = await ContractModel.findOneAndDelete({ ContractID });
    if (!deletedContract) {
      return res.status(404).send({ message: 'Contract not found' });
    }
    return res.status(200).send({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};
