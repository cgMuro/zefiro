const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    title_url: {
        type: String,
        unique: true
    },
    text: {
        type: Array,
        required: [true, 'Please add some text']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    header_img: {
        type: String,
        required: [true, 'Please add a cover image']
    }, 
    author: {
        type: Object,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})

// Error Handler Middleware
ArticleSchema.post('save', (error, doc ,next) => {
    if(error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Duplicate key error'))
    } else {
        next( new Error(error))
    }
})

module.exports = mongoose.model('Article', ArticleSchema)


// {
// 	"title": "My title (1)",
// 	"text": "Not a very good text",
// 	"description": "Not a very good description",
// 	"header_img": "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=2000"
// }