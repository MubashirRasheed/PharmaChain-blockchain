import mongoose from "mongoose";
import ProductModel from "../Models/ProductModel.js";

// Crud Operations
export const GetProduct = async (req, res, next) => {
  try {
    ProductModel.find({ _id: req.params.id }).exec(function (error, data) {
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

export const GetAllProducts = async (req, res, next) => {
  console.log(req.body);
  ProductModel.find({}).exec(function (error, data) {
    // console.log("abc");
    if (error) {
      return next(error);
    }
    res.json(data);
  });
};

// export const GetAllProducts = async (req, res) => {
//   try {
//     const products = await ProductModel.find({});
//     console.log(products);
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Async function to add a new product to the Products collection
export const AddNewProduct = async (req, res) => {
  try {
    const newProduct = new ProductModel({

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

    const savedProduct = await newProduct.save(); // Save the new product to the database

    res.status(201).json(savedProduct); // Return the saved product as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};


export const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // const { ProductID, ProductName, CustomerEmail, ProductImageUrl, ProjectName, Status, StatusBg, Quantity, Price, Location } = req.body;


    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   console.log(id, 'Invalid ID');
    //   return res.status(400).send({ message: 'Invalid ID', id });
    // }

    console.log(id, 'mongooseID');
    const product = await ProductModel.findOneAndUpdate({id:id}, {
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

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({ product });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


// Async function to delete a product by its ProductID
export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findOneAndDelete({ id });
    if (!deletedProduct) {
      return res.status(404).send({ message: 'Product not found' });
    }
    return res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

