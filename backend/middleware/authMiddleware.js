import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
    let token

    // Check for the token
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get the token
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            
            // Fetch the user by id, no password
            req.user = await User.findById(decoded.id).select('-password')

            // What is this for?
            next()
        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token) {
        // 401 - unauthorized
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin) {
        next()
    } else {
        // 401 - Not Authorized
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export { protect, admin }