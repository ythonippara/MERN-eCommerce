import express from 'express'
const router = express.Router()
import { 
    addOrderItems, 
    getOrderById,
    updateOrderToPaid
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

// API routes
router.route('/').post(protect, addOrderItems)
// This route has to be placed at the bottom
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router