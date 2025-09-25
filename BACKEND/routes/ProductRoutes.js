import express from "express";
import {
    createProductController,
    getAllProductsController,
    getProductByIdController,
    updateProductController,
    deleteProductController
} from "../controller/ProductController.js";



const ProductRouter = express.Router();

// Routes
ProductRouter.post("/", createProductController);
ProductRouter.get("/", getAllProductsController);
ProductRouter.get("/:id", getProductByIdController);
ProductRouter.put("/:id", updateProductController);
ProductRouter.delete("/:id", deleteProductController);



export default ProductRouter;