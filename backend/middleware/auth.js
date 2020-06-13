const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')

    // Check for token
    if(!token) return res.status(401).json({ msg: 'No token. Authorization denied.' })

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.jwt_Secret)
        req.user = decoded
        next()
    } catch (error) {
        res.status(400).json({ msg: 'Token is invalid' })
    }
}

module.exports = auth