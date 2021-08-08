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

// Create a user with user schema
const User = mongoose.model('User', userSchema)

export default User