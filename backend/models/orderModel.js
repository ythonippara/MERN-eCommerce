import mongoose from 'mongoose'

const orderSchema = mongoose.Schema({

    // Add a relationship between a product and a user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        requred: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: { 
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            }
        }
    ],
    // Embedded object
    shippingAddress: {
        address: { String, required: true },
        city: { String, required: true },
        postalCode: { String, required: true },
        country: { String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true 
    },
    paymentReuslt: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    }, 
    paidAt: {
    type: Date
    }, 
    iseDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
})

// Create a user with user schema
const Order = mongoose.model('Order', orderSchema)

export default Order