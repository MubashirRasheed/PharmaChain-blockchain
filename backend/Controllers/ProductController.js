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
      ProductID: req.body.ProductID,
      ProductName: req.body.ProductName,
      CustomerEmail: req.body.CustomerEmail,
      ProductImageUrl: req.body.ProductImageUrl,
      ProjectName: req.body.ProjectName,
      Status: req.body.Status,
      StatusBg: req.body.StatusBg,
      Quantity: req.body.Quantity,
      Price: req.body.Price,
      Location: req.body.Location,
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
    const { ProductID, ProductName, CustomerEmail, ProductImageUrl, ProjectName, Status, StatusBg, Quantity, Price, Location } = req.body;

    const product = await ProductModel.findByIdAndUpdate(id, { 
      ProductID, 
      ProductName, 
      CustomerEmail, 
      ProductImageUrl, 
      ProjectName, 
      Status, 
      StatusBg, 
      Quantity, 
      Price, 
      Location 
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
    const { ProductID } = req.params;
    const deletedProduct = await ProductModel.findOneAndDelete({ ProductID });
    if (!deletedProduct) {
      return res.status(404).send({ message: 'Product not found' });
    }
    return res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

