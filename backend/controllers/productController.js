import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // Limit the number of products displayed on the page
    const pageSize = 10

    // Get page number from the URL, or set it to 1
    const page = Number(req.query.pageNumber) || 1

    // req.query gets query strings
    const keyword = req.query.keyword ? { 
        // Match keyword to the name
        name: {
            // Use regular expressions
            $regex: req.query.keyword,
            // What is options for?
            $options: 'i'
        }
     } : {}

     // Get the total count of products
     const count = await Product.countDocuments({ ...keyword })

    // Use Product model pass empty object will the data
    const products = await Product
        .find({ ...keyword })
        // Limit by page size (if pageSize = 2, return 2 products).
        .limit(pageSize)
        // Page 1:  2*(1-1) = 0, so skip 0 products. 
        // Page 2:  2*(2-1) = 2, so skip 2 products.
        .skip(pageSize * (page - 1))

    // Test error message for videos 28 and 29
    //res.status(401)
    //throw new Error ('Not Authorized!')

    // Serve json array
    // If we have four products, count = 4 and pages would be 4 / 2 = 2 pages
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        res.json(product)
    } else {
        // res.status(404).json({ message: 'Product not found' })
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if(product) {
        await product.remove()
        res.json({ message: 'Product removed' })
    } else {
        // 404 - Page Not Found
        res.status(404)
        throw new Error('Product not found')
    }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    // Instantiate a new product
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    // Get data from the body
    const { 
        name, 
        price,
        description,
        image,
        brand,
        category,
        countInStock
     } = req.body

     const product = await Product.findById(req.params.id)

     if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.json(updatedProduct)
     } else {
         res.status(404)
         throw new Error('Product not found')
     }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    // Get data from the body
    const { rating, comment } = req.body

     const product = await Product.findById(req.params.id)

     if(product) {
        const alreadyReviewed = product.reviews.find(review => review.user.toString() === req.user._id.toString())

        if(alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        // If review doesn't exist construct a Review object
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        }

        // Add a new review to the array of reviews
        product.reviews.push(review)

        // Update the number of reviews
        product.numReviews = product.reviews.length

        //Update total rating
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        // Save to the database
        await product.save()
        res.status(201).json({ message: 'Review added'})
     } else {
         res.status(404)
         throw new Error('Product not found')
     }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
    // Use -1 to sort in ascending order, get 3 products
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.json(products)
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
}