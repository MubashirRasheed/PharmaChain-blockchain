import mongoose from "mongoose";
import SupplierModel from "../Models/SupplierModel.js";

// Crud Operations
export const GetSupplier = async (req, res, next) => {
  try {
    SupplierModel.find({ _id: req.params.id }).exec(function (error, data) {
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

export const GetAllSuppliers = async (req, res, next) => {
  console.log(req.body);
  SupplierModel.find({}).exec(function (error, data) {
    // console.log("abc");
    if (error) {
      return next(error);
    }
    res.json(data);
  });
};

// export const GetAllSuppliers = async (req, res) => {
//   try {
//     const Suppliers = await SupplierModel.find({});
//     console.log(Suppliers);
//     res.status(200).json(Suppliers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Async function to add a new Supplier to the Suppliers collection
export const AddNewSupplier = async (req, res) => {
  try {
    const newSupplier = new SupplierModel({

      id : req.body.id,
      sku: req.body.sku,
      name : req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      offerEnd: req.body.offerEnd,
      new: req.body.new,
      rating: req.body.rating,
      saleCount: req.body.saleCount,
      stock: req.body.stock,
      category: req.body.category,
      tag: req.body.tag,
      image: req.body.image,
      shortDescription: req.body.shortDescription,
      fullDescription: req.body.fullDescription,

    });

    const savedSupplier = await newSupplier.save(); // Save the new Supplier to the database

    res.status(201).json(savedSupplier); // Return the saved Supplier as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};


export const UpdateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    // const { SupplierID, SupplierName, CustomerEmail, SupplierImageUrl, ProjectName, Status, StatusBg, Quantity, Price, Location } = req.body;


    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   console.log(id, 'Invalid ID');
    //   return res.status(400).send({ message: 'Invalid ID', id });
    // }

    console.log(id, 'mongooseID');
    const supplier = await SupplierModel.findOneAndUpdate({id:id}, {
      id : req.body.id,
      sku: req.body.sku,
      name : req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      offerEnd: req.body.offerEnd,
      new: req.body.new,
      rating: req.body.rating,
      saleCount: req.body.saleCount,
      stock: req.body.stock,
      category: req.body.category,
      tag: req.body.tag,
      image: req.body.image,
      shortDescription: req.body.shortDescription,
      fullDescription: req.body.fullDescription,
    }, { new: true });

    if (!supplier) {
      return res.status(404).send({ message: "Supplier not found" });
    }

    res.status(200).send({ supplier });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


// Async function to delete a Supplier by its SupplierID
export const DeleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupplier = await SupplierModel.findOneAndDelete({ id });
    if (!deletedSupplier) {
      return res.status(404).send({ message: 'Supplier not found' });
    }
    return res.status(200).send({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

