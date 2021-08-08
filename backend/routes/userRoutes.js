import express from 'express'
const router = express.Router()
import { authUser, getUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

// API routes
router.post('/login', authUser)
// To implement middleware put it as first argument
router.route('/profile').get(protect, getUserProfile)

export default router