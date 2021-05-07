import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
    try {
        // Delete everything
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        // Create an array of users
        const createdUsers = await User.insertMany(users)
        // Extract admin user from the array
        const adminUser = createdUsers[0]._id

        // Loop through the products and connect admin user
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data imported!'.green.inverse)
        process.exit()

    } catch (error) {
        console.error(`${error}`.red.inverse)
        // Exit with failure
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        // Delete everything
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        console.log('Data destroyed!'.red.inverse)
        process.exit()

    } catch (error) {
        console.error(`${error}`.red.inverse)
        // Exit with failure
        process.exit(1)
    }
}

// import with node backend/seeder
// destroy with node backend/seeder -d
// 2 index stands for -d
if(process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}