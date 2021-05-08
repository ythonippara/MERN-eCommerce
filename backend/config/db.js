import mongoose from 'mongoose'

// Using async for promise
const connectDB =  async () => {
    try {
        const conn =  await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.error(`Error: ${error.message}`.red.bold)
        // 1 - exit with failure
        process.exit(1)
    }
}

export default connectDB