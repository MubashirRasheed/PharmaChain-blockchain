import mongoose from "mongoose";
// import validator from "validator";

const distributorSchema = mongoose.Schema({
  id: {
    type : Number
  },
  sku: {
    type: String
  },
  name: {
    type: String
  },
  price: {
    type: Number
  },
  discount: {
    type: Number
  },
  offerEnd: {
    type: String
  },
  new: {
    type: Boolean
  },
  rating: {
    type: Number
  },
  saleCount: {
    type: Number
  },
  stock: {
    type: Number
  },
  category: {
    type: Array
  },
  tag: {
    type: Array
  },
  image: {
    type: Array
  },
  shortDescription: {
    type: String
  },
  fullDescription: {
    type: String
  }
});


const DistributorModel = mongoose.model("distributor-database", distributorSchema);

// module.exports = Product;
export default DistributorModel;
