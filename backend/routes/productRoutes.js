import express from 'express'
import asyncHandler from 'express-async-handler'
const router = express.Router()
import Product from '../models/productModel.js'

// API routes

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
    // Use Product model pass empty object will the data
    const products = await Product.find({})
    // Serve json array
    res.json(products)
}))

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        res.json(product)
    } else {
        res.status(404).json({ message: 'Product not found' })
    }
}))

export default router