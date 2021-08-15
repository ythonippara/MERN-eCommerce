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

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    // Pull out email & password from the body
    const { name, email, password } = req.body

    // Find one document by email
    const userExists = await User.findOne({ email })

    if(userExists) {
        // 400 - bad request
       res.status(400)
       throw new Error('User already exists')
    }

    // Create method corresponds to save
    const user = await User.create({
        name,
        email,
        password
    })

    if(user) {
        // 201 - something was created
        // Authenticate user after registration
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
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

// @desc    Update user profile for logged in user
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    // Find user
    // req.user can be used in any protected route
    const user = await User.findById(req.user._id)

    if(user) {
        // Set a new name from body
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        // First, check if a password was sent
        // So re-typing a new password is not required???
        if(req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    } else {
        // 404 - not found
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Pass an empty object to get all users
    const users = await User.find({})
    res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    // Find a user by ID
    const user = await User.findById(req.params.id)
    
    if(user) {
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        // 404 - Page Not Found
        res.status(404)
        throw new Error('User not Found')
    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    // Get a user by ID from the URL
    const user = await User.findById(req.params.id).select('-password')
    if(user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not Found')
    }
    
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    // Find user with ID from the URL
    const user = await User.findById(req.params.id)

    if(user) {
        // Set a new name from body
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin // no need for another condition
        
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        // 404 - not found
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
}