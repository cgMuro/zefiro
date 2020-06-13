const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorResponse = require('../ErrorResponse')
const auth = require('../middleware/auth')
const routerArticles = require('../routes/articles')

const User = require('../models/User')


// @method: POST
// @route: api/users
// @desc: Create new user
// @access: public

router.post('/', async (req, res, next) => {

    const { name, email, password } = req.body

    if (!name || !email || !password) return res.status(400).json({ msg: 'Please enter all fields' })
    // next(new ErrorResponse('Please enter all fields', 400))

    const existingUser = await User.findOne({ email })

    if (existingUser) return res.status(400).json({ msg: 'User already exists' })
    // next(new ErrorResponse('User already exists', 400))

    // SECURITY
    // Create salt & hash
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(password, salt)

    try {
        const newUser = await User.create(req.body)

        jwt.sign(
            { id: newUser.id },
            process.env.jwt_Secret,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err

                res.status(201).json({
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        penName: newUser.pen_name ? newUser.pen_name : null
                    },
                    token
                })
            }
        )
    } catch (error) {
        if (error.message === 'Duplicate key error') {
            res.status(400).json('This email is already taken')
        } else {
            return next(error)
        }
    }
})


// @method: PUT
// @route: api/users
// @desc: Update user (only name and pen name)
// @access: private

router.put('/:id', auth, async (req, res, next) => {
    try {
        const updUser = await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ success: true, data: updUser });
    } catch (error) {
        return next(new Error(error))
    }
})



module.exports = router