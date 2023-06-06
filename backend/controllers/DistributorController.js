import mongoose from "mongoose";
import DistributorModel from '../models/DistributorSchema.js'

// Crud Operations
export const GetDistributor = async (req, res, next) => {
  try {
    DistributorModel.find({ _id: req.params.id }).exec(function (error, data) {
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

export const GetAllDistributors = async (req, res, next) => {
  console.log(req.body);
  DistributorModel.find({}).exec(function (error, data) {
    // console.log("abc");
    if (error) {
      return next(error);
    }
    res.json(data);
  });
};

// export const GetAllDistributors = async (req, res) => {
//   try {
//     const Distributors = await DistributorModel.find({});
//     console.log(Distributors);
//     res.status(200).json(Distributors);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Async function to add a new Distributor to the Distributors collection
export const AddNewDistributor = async (req, res) => {
  try {
    const newDistributor = new DistributorModel({

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

    const savedDistributor = await newDistributor.save(); // Save the new Distributor to the database

    res.status(201).json(savedDistributor); // Return the saved Distributor as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};


export const UpdateDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    // const { DistributorID, DistributorName, CustomerEmail, DistributorImageUrl, ProjectName, Status, StatusBg, Quantity, Price, Location } = req.body;


    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   console.log(id, 'Invalid ID');
    //   return res.status(400).send({ message: 'Invalid ID', id });
    // }

    console.log(id, 'mongooseID');
    const distributor = await DistributorModel.findOneAndUpdate({id:id}, {
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

    if (!distributor) {
      return res.status(404).send({ message: "Distributor not found" });
    }

    res.status(200).send({ distributor });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


// Async function to delete a Distributor by its DistributorID
export const DeleteDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDistributor = await DistributorModel.findOneAndDelete({ id });
    if (!deletedDistributor) {
      return res.status(404).send({ message: 'Distributor not found' });
    }
    return res.status(200).send({ message: 'Distributor deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

