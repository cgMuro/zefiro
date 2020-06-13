const router = require('express').Router();

const Draft = require('../models/Draft')
const User = require('../models/User')
const auth = require('../middleware/auth')



// @method: GET
// @path: /api/drafts/:id
// @desc: get single draft by id
// @access: private

router.get('/:id', auth, async (req, res, next) => {
    const draft = await Draft.findById(req.params.id);

    if (!draft) return res.status(400).json(`Article not found with title of ${req.params.id}`)

    res.status(200).json({
        success: true,
        draft
    })
})



// @method: GET
// @path: /api/drafts/user/:user-id
// @desc: get drafts by user id
// @access: private

router.get('/user/:userId', auth, async (req, res, next) => {

    const drafts = await Draft.find();

    res.status(200).json({
        success: true,
        data: drafts.filter(draft => draft.author.id === req.params.userId)
    })
})



// @method: POST
// @path: /api/drafts
// @desc: create a new draft
// @access: private

router.post('/', auth, async (req, res, next) => {

    // get id and name/pen name of the user
    const { id, name, pen_name } = await User.findById(req.user.id)

    // add user to req.body
    req.body.author = {
        id,
        name: pen_name ? pen_name : name
    }

    // Create random title_url
    req.body.title_url = Math.random()


    try {
        const newDraft = await Draft.create(req.body);

        res.status(201).json({
            success: true,
            msg: 'Draft created',
            created_draft: newDraft
        })
    } catch (error) {
        next(new Error(error))
    }
})


// @method: PUT
// @path: /api/drafts/:id
// @desc: update a draft by id
// @access: private

router.put('/:id', auth, async (req, res, next) => {

    let draft = await Draft.findById(req.params.id);

    if (!draft) return res.status(400).json({ msg: `Draft not found with id of ${req.params.id}` })

    // Make sure user is owner
    if (draft.author.id.toString() !== req.user.id) return res.status(400).json({ msg: 'You are not authorized to update' })
    // return next(new ErrorResponse('You are not authorized to update', 401))

    try {
        draft = await Draft.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            success: true,
            msg: 'Draft updated',
            updated_draft: draft
        })
    } catch (error) {
        return next(new Error(error))
    }
})


// @method: DELETE
// @path: /api/drafts/:id
// @desc: delete a draft
// @access: private

router.delete('/:id', auth, async (req, res, next) => {

    const dltDraft = await Draft.findById(req.params.id);

    if (!dltDraft) return res.status(400).json({ msg: `Draft not found with id of ${req.params.id}` })

    // Make sure user is the owner
    if (dltDraft.author.id.toString() !== req.user.id) return res.status(400).json({ msg: 'You are not authorized to delete' })

    dltDraft.remove()

    res.status(200).json({
        success: true,
        msg: 'Draft deleted',
        deleted_draft: dltDraft
    })
})

module.exports = router