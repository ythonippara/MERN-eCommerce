// ESM style imports
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
// Import of a file requires .js extension
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

// Config will read .env file, parse the contents
dotenv.config()

connectDB()

// Initialize express
const app = express()

// Middleware for morgan
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Allow JSON data in the body
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API is running...')
})

// Mount routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// Config route (fetch PayPal Client ID)
app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
)

// Make uploads folder static and accessible to a browser
// This __dirname syntax is only available when using common JS
// Hence path.resolve() workaround
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// Custom middleware
app.use(notFound)
app.use(errorHandler)

// Pull port from the env var or if not found use 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}.`.yellow.bold))