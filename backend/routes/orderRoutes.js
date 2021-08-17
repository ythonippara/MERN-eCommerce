import express from 'express'
const router = express.Router()
import { 
    addOrderItems, 
    getOrderById,
    updateOrderToPaid,
    getMyOrders, getOrders
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// API routes
router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
// This route has to be placed at the bottom
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router