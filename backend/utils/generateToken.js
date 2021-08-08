import jwt from "jsonwebtoken"

// Take user id as a payload
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        // Third argument, token expires in 30 days
        expiresIn: '30d'
    })
}

export default generateToken