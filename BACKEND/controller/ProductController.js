import {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
} from "../service/ProductService.js";


export const createProductController = async (req, res) => {
    try {
        const productData = req.body;

        const { name, description, price, image } = productData;
        if (!name || !description || !price) {
            return res.status(400).json({ message: "Name, description, and price are required" });
        }

        const newProduct = await createProductService(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: error.message });
    }
};


export const getAllProductsController = async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
};


export const getProductByIdController = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ message: error.message });
    }
};


export const updateProductController = async (req, res) => {
    try {
        const updatedProduct = await updateProductService(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message });
    }
};


export const deleteProductController = async (req, res) => {
    try {
        const deletedProduct = await deleteProductService(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: error.message });
    }
};
