import mongoose from "mongoose";
import ManufacturerModel from "../Models/ManufacturerModel.js";

// Crud Operations
export const GetManufacturer = async (req, res, next) => {
  try {
    ManufacturerModel.find({ _id: req.params.id }).exec(function (error, data) {
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

export const GetAllManufacturers = async (req, res, next) => {
  console.log(req.body);
  ManufacturerModel.find({}).exec(function (error, data) {
    // console.log("abc");
    if (error) {
      return next(error);
    }
    res.json(data);
  });
};

// export const GetAllManufacturers = async (req, res) => {
//   try {
//     const Manufacturers = await ManufacturerModel.find({});
//     console.log(Manufacturers);
//     res.status(200).json(Manufacturers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Async function to add a new Manufacturer to the Manufacturers collection
export const AddNewManufacturer = async (req, res) => {
  try {
    const newManufacturer = new ManufacturerModel({

      id: req.body.id,
      sku: req.body.sku,
      name: req.body.name,
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
    console.log(newManufacturer);
    const savedManufacturer = await newManufacturer.save(); // Save the new Manufacturer to the database

    res.status(201).json(savedManufacturer); // Return the saved Manufacturer as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};


export const UpdateManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    // const { ManufacturerID, ManufacturerName, CustomerEmail, ManufacturerImageUrl, ProjectName, Status, StatusBg, Quantity, Price, Location } = req.body;


    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   console.log(id, 'Invalid ID');
    //   return res.status(400).send({ message: 'Invalid ID', id });
    // }

    console.log(id, 'mongooseID');
    const manufacturer = await ManufacturerModel.findOneAndUpdate({ id: id }, {
      id: req.body.id,
      sku: req.body.sku,
      name: req.body.name,
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

    if (!manufacturer) {
      return res.status(404).send({ message: "Manufacturer not found" });
    }

    res.status(200).send({ manufacturer });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


// Async function to delete a Manufacturer by its ManufacturerID
export const DeleteManufacturer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManufacturer = await ManufacturerModel.findOneAndDelete({ id });
    if (!deletedManufacturer) {
      return res.status(404).send({ message: 'Manufacturer not found' });
    }
    return res.status(200).send({ message: 'Manufacturer deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

