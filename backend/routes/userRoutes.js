import express from 'express'
const router = express.Router()
import { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

// API routes
router.route('/').post(registerUser).get(protect, admin, getUsers)
router.post('/login', authUser)
// To implement middleware put it as first argument
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
// This request needs to be at the bottom
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
