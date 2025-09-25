import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: { // Here the name is changed from imageUrl to image
        type: String,
        required: false // Optional
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;