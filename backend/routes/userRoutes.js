import express from 'express'
const router = express.Router()
import { authUser} from '../controllers/userController.js'

// API routes
router.post('/login', authUser)

export default router