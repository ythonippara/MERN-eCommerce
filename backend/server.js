// Common JS, ES modules for frontend
const express = require('express')
const products = require('./data/products')

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

app.listen(5000, console.log('Server is running on port 5000.'))