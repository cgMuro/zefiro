const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    pen_name: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date
    }
})

// Duplicate email Error Handler Middleware
UserSchema.post('save', (error, doc ,next) => {
    if(error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Duplicate key error'))
    } else {
        next( new Error(error))
    }
})

module.exports = mongoose.model('User', UserSchema)