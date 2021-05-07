import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        // 10 is default length
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'John Smith',
        email: 'john@example.com',
        password: bcrypt.hashSync('123456', 10)
    },
    {
        name: 'Jane Miller',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10)
    }
]

export default users