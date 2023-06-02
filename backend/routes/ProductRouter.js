import express from 'express';

import { AddNewProduct, GetAllProducts, DeleteProduct
, UpdateProduct } from "../controllers/ProductController.js";

let ProductRouter = express.Router();

ProductRouter.post("/addNewProduct", AddNewProduct);

ProductRouter.get("/allProducts", GetAllProducts);

ProductRouter.delete("/deteleProduct/:id", DeleteProduct);

ProductRouter.put("/updateProduct/:id", UpdateProduct);


export default ProductRouter;