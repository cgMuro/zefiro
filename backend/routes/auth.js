const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../ErrorResponse')

const User = require('../models/User')
const auth = require('../middleware/auth')


// @method: GET
// @route: api/auth/user
// @desc: Get User Data
// @access: Private

router.get('/user', auth, async(req, res, next) => {

    const user = await User.findById(req.user.id).select('-password')

    res.json(user)
})



// @method: POST
// @route: api/auth
// @desc: Authenticate user
// @access: Public

router.post('/', async(req, res, next) => {

    const { email, password } = req.body

    // Validate input
    if(!email || !password) return res.status(400).json({ msg: 'Please enter all fields' })
    // next(new ErrorResponse('Please enter all fields', 400))

    const user = await User.findOne({ email })

    // Validate user
    if(!user) return res.status(400).json({ msg: 'User does not exist' })
    // next(new ErrorResponse('User does not exist', 400))

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' })
    // next(new ErrorResponse('Invalid credentials', 400))

    jwt.sign(
        { id: user.id },
        process.env.jwt_Secret,
        { expiresIn: 3600 },
        (err, token) => {
            if(err) throw err
            
            res.status(200).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            })
        }
    )
})

module.exports = router