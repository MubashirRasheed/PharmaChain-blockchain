import mongoose from 'mongoose';

// Define the schema
const productSchema = new mongoose.Schema({
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

// Create the model using the schema
const PharmacyProduct = mongoose.model('pharmacy-products', productSchema);

export default PharmacyProduct;
