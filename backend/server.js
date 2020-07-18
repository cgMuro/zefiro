const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const error = require('./middleware/errorHandler')
const path = require('path')

const connectDB = require('./config/db')

dotenv.config({ path: './.env' })

connectDB()

const app = express();

app.use(cors())

// Body parser
app.use(express.json())

// Error handler middleware
app.use(error)

// Mount routes
app.use('/api/articles', require('./routes/articles'))
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/drafts', require('./routes/drafts'))

// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    // Set Static folder
    app.use(express.static('../frontend/build'))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(path.dirname(__dirname), 'frontend', 'build', 'index.html'))
    })
}

// // Handle not existing routes
// app.use((req, res, next) => {
//     res.status(404).json({
//         status: 404,
//         error: 'Not found'
//     })
// })


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))