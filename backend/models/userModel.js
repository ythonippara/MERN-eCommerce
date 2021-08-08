import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

// Take plain-text password and match with the encrypted one
userSchema.methods.matchPassword = async function(enteredPassword) {
    // Return a promise
    return await bcrypt.compare(enteredPassword, this.password)
}

// Encrypt the password before saving a new user, not used for profile updates
userSchema.pre('save', async function(next) {
    // Check if the password field has been modified
    // isModified method is a part of mongoose
    if(!this.isModified('password')) {
        next()
    }
    // Generate salt, 10 is the number of rounds
    const salt = await bcrypt.genSalt(10)
    this.password =  await bcrypt.hash(this.password, salt)
})

// Create a user with user schema
const User = mongoose.model('User', userSchema)

export default User