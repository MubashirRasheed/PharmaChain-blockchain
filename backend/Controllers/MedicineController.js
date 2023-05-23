import MedicineModel from "../Models/MedicineModel.js";

// Crud Operations
const GetMedicine = async (req, res, next) => {
    try {
      MedicineModel.find({ _id: req.params.id }).exec(function (error, data) {
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
  
  const GetAllMedicines = async (req, res, next) => {
    console.log(req.body);
    MedicineModel.find({}).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  };
  
  const AddNewMedicine = async (req, res, next) => {
    try {
      console.log("Got a request for creating a new Medicine");
      console.log(req.body);
  
      MedicineModel.create(req.body)
        .then(function (data) {
          console.log(data);
          res.status(200);
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
          res.send(err.message);
        });
    } catch (error) {
      console.log("Error encountered: ", error.message);
      next(error);
    }
  };
  
  const UpdateMedicine = async (req, res, next) => {
    await MedicineModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      quantity: req.body.quantity,
      inStock: req.body.inStock,
      description: req.body.description,
    });
    let newMedicine = await MedicineModel.findById(req.params.id);
    res.json(newMedicine);
  };
  
  const DeleteMedicine = async (req, res, next) => {
    MedicineModel.deleteOne({ _id: req.params.id }).exec(function (error, data) {
      if (error) {
        next(error);
      }
      res.json(data);
    });
  };
  
  export default {
    AddNewMedicine,
    UpdateMedicine,
    GetMedicine,
    GetAllMedicines,
    DeleteMedicine,
  };