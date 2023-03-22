import mongoose from "mongoose";
// import validator from "validator";

const productSchema = mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ProductID: {
      type: String,
      required: true,
      trim: true,
    },    
    ProductName: {
      type: String,
      required: true,
      trim: true,
    },
    CustomerEmail: {
      type: String,
      // required: true,
      trim: true,
      default:'',
    },
    ProductImageUrl: {
      type: String,
      // required: true,
      trim: true,
    },
    ProjectName: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      required: true,
      trim: true,
    },
    StatusBg: {
      type: String,
      trim: true,
    },
    Quantity: {
      type: String,
      required: true,
      trim: true,
      // default: 0,
    },
    Price: {
      type: String,
      required: true,
    },
    Location: {
      type: String,
      // required: true,
      // default: "",
    },
  },{
    timestamps: true
  }
);


const Product = mongoose.model("products", productSchema);

// module.exports = Product;
export default Product;
