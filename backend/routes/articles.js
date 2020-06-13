const router = require('express').Router();
const ErrorResponse = require('../ErrorResponse')

const Article = require('../models/Article')
const User = require('../models/User')
const auth = require('../middleware/auth')

// @method: GET
// @path: /api/articles
// @desc: get all articles in database
// @access: public

router.get('/', async (req, res, next) => {
    const articles = await Article.find();

    res.status(200).json({
        success: true,
        data: articles
    })
})

// @method: GET
// @path: /api/articles/user/:user-id
// @desc: get articles by user id
// @access: private

router.get('/user/:id', async (req, res, next) => {
    const articles = await Article.find();

    res.status(200).json({
        success: true,
        data: articles.filter(article => article.author.id === req.params.id)
    })
})



// @method: GET
// @path: /api/articles/:title
// @desc: get single article by title
// @access: public

router.get('/:title', async (req, res, next) => {
    const article = await Article.findOne({ title_url: req.params.title });

    if (!article) return res.status(400).json(`Article not found with title of ${req.params.title}`)
    // next(new ErrorResponse(`Article not found with title of ${req.params.title}`, 400))

    res.status(200).json({
        success: true,
        article
    })
})



// @method: POST
// @path: /api/articles/add
// @desc: create a new article
// @access: private

router.post('/add', auth, async (req, res, next) => {

    // get id and name/pen name of the user
    const { id, name, pen_name } = await User.findById(req.user.id)

    // add user to req.body
    req.body.author = {
        id,
        name: pen_name !== '' ? pen_name : name
    }

    // Create title_url
    if (req.body.title) {
        req.body.title_url = req.body.title.split(' ').join('-')
    }

    try {
        const newArticle = await Article.create(req.body);

        res.status(201).json({
            success: true,
            msg: 'Article created',
            created_article: newArticle
        })
    } catch (error) {
        if (error.message === 'Duplicate key error') {
            res.status(400).json('Duplicate key for title_url')
        } else {
            return next(error)
        }
    }
})



// @method: GET
// @path: /api/articles/edit/:id
// @desc: get article by id
// @access: public

router.get('/edit/:id', auth, async (req, res, next) => {
    const article = await Article.findById(req.params.id);

    if (!article) return res.status(400).json({ msg: `Article not found with id of ${req.params.id}` })
    // return next(new ErrorResponse(`Article not found with id of ${id}`, 400))

    // Make sure user is owner
    if (article.author.id.toString() !== req.user.id) return res.status(400).json({ msg: 'You are not authorized to edit' })
    // next(new ErrorResponse('You are not authorized to update', 401))

    res.status(200).json({
        success: true,
        data: article
    })
})

// @method: PUT
// @path: /api/articles/edit/:id
// @desc: edit an article
// @access: private

router.put('/edit/:id', auth, async (req, res, next) => {
    let article = await Article.findById(req.params.id);

    if (!article) return res.status(400).json({ msg: `Article not found with id of ${req.params.id}` })
    // return next(new ErrorResponse(`Article not found with id of ${id}`, 400))

    // Make sure user is owner
    if (article.author.id.toString() !== req.user.id) return res.status(400).json({ msg: 'You are not authorized to update' })
    // return next(new ErrorResponse('You are not authorized to update', 401))

    try {
        article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true
        })

        res.status(200).json({
            success: true,
            msg: 'Article updated',
            updated_article: article
        })
    } catch (error) {
        return next(new Error(error))
    }
})


// @method: DELETE
// @path: /api/articles/delete/:id
// @desc: delete an article
// @access: private

router.delete('/delete/:id', auth, async (req, res, next) => {
    const dltArticle = await Article.findById(req.params.id);

    if (!dltArticle) return res.status(400).json({ msg: `Article not found with id of ${req.params.id}` })
    // return next(new ErrorResponse(`Article not found with id of ${id}`, 400))

    // Make sure user is the owner
    if (dltArticle.author.id.toString() !== req.user.id) return res.status(400).json({ msg: 'You are not authorized to delete' })
    // return next(new ErrorResponse('You are not authorized to delete', 401))

    dltArticle.remove()

    res.status(200).json({
        success: true,
        msg: 'Article deleted',
        deleted_article: dltArticle
    })
})

module.exports = router