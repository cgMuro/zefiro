const mongoose = require('mongoose')

const DraftSchema = new mongoose.Schema({
    title: String,
    title_url: String,
    text: Array,
    description: String,
    header_img: String, 
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

module.exports = mongoose.model('Draft', DraftSchema)