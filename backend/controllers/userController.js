import asyncHandler from 'express-async-handler'
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
            token: null,
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
    const product = await User.findById(req.params.id)

    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    getUserById
}