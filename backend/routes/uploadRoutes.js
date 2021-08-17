import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

// Config
// Initialize storage engine, pass object with 2 functions
// cb - callback, pass null for the error?
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        // Path module, extname method gets the extension of a file name
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

// Validate the type of image by the extension
function checkFileType(file, cb) {
    // Create an expression with the file types we want
    const filetypes = /jpg|jpeg|png/
    // Test given files against the defined filetypes expression
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()) // returns true or false
    // What's mime type??
    const mimetype = filetypes.test(file.mimetype) // returns true or false

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        // Pass in error
        cb('Images only!')
    }
}

// Middleware
const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb)
    }
})

// Route/Endpoint
// Use slash because it will be connected to /api/upload
router.post('/', upload.single('image'), (req, res) => {
    // Pass the path
    res.send(`/${req.file.path}`)
})

export default router