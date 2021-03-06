import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        // Why return with nothing else?
        return
    } else {
        // Create a new order in the database
        // Instantiate Order object
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    // Get order ID from the URL using req.params.id
    // Research populate() !!!
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order) {
        res.json(order)
    } else {
        res.status('404')
        throw new Error('Order not found')
    }
})

// @desc    Update order status to "paid"
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    // Get order ID from the URL using req.params.id
    // Research populate() !!!
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        // Comes from PayPal
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            // Comes from Payer object
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status('404')
        throw new Error('Order not found')
    }
})

// @desc    Update order status to "delivered"
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    // Get order ID from the URL using req.params.id
    // Research populate() !!!
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        const updatedOrder = await order.save()

        res.json(updatedOrder)
    } else {
        res.status('404')
        throw new Error('Order not found')
    }
})

// @desc    Display orders for logged in users
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    // Display all orders for a specific user
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
})

// @desc    Display all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    // Display all orders, populate user details
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

export { 
    addOrderItems, 
    getOrderById, 
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
}