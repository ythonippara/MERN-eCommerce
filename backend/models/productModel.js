import mongoose from 'mongoose'

// Review schema contains individual reviews and ratings
const reviewSchema = mongoose.Schema({
    // Add a relationship between a review and a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
}, {
    timestamps: true
})

// Contains average reviews and ratings
const productSchema = mongoose.Schema({

    // Add a relationship between a product and a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true 
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
})

// Create a product with product schema
const Product = mongoose.model('Product', productSchema)

export default Product