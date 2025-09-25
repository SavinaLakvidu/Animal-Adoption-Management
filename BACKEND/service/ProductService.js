import Product from '../model/product.js';

export const createProductService = async (productData) => {
    try {
        const product = new Product(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw new Error("Error creating product: " + error.message);
    }
};

export const getAllProductsService = async () => {
    try {
        const products = await Product.find({}).select('name description price image');
        return products;
    } catch (error) {
        throw new Error("Error fetching products: " + error.message);
    }
};



export const getProductByIdService = async (id) => {
    try {
        const product = await Product.findById(id);
        if (!product) throw new Error("Product not found");
        return product;
    } catch (error) {
        throw new Error("Error fetching product: " + error.message);
    }
};


export const updateProductService = async (id, updateData) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedProduct) throw new Error("Product not found");
        return updatedProduct;
    } catch (error) {
        throw new Error("Error updating product: " + error.message);
    }
};

// ID එක මගින් product එකක් delete කිරීම
export const deleteProductService = async (id) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) throw new Error("Product not found");
        return deletedProduct;
    } catch (error) {
        throw new Error("Error deleting product: " + error.message);
    }
};

