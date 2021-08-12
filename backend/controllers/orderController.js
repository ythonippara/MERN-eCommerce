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
        totalprice
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
            totalprice
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

export { addOrderItems }