import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc    Auth a user & get a token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    // Pull out email & password from the body
    const { email, password } = req.body

    // Test
    //res.send({
        //email, 
        //password,
    //})

    // Find one document by email
    const user = await User.findOne({ email })

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // Find user
    // req.user can be used in any protected route
    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        // 404 - not found
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser, 
    getUserProfile,
}