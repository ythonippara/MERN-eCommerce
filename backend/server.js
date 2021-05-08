// ESM style imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
// Import of a file requires .js extension
import productRoutes from './routes/productRoutes.js'

// Config will read .env file, parse the contents
dotenv.config()

connectDB()

// Initialize express
const app = express()

app.get('/', (req, res) => {
    res.send('API is running...')
})

// Mount routes
app.use('/api/products', productRoutes)

// Custom middleware
app.use(notFound)

app.use(errorHandler)

// Pull port from the env var or if not found use 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow.bold))