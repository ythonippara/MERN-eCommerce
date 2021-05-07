// ESM style imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
// Import of a file requires .js extension
import products from './data/products.js'

// Config will read .env file, parse the contents
dotenv.config()

connectDB()

// Initialize express
const app = express()

app.get('/', (req, res) => {
    res.send('API is running...')
})

// API routes
app.get('/api/products', (req, res) => {
    // Serve json array
    res.json(products)
})

// Get a single product by id
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p._id === req.params.id)
    res.json(product)
})

// Pull port from the env var or if not found use 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow.bold))