const Posts = require('../data/db.js')

const router = require('express').Router()

router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'The posts information could not be retrieved.'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)

        if (post && post.length > 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            error: "The post information could not be retrieved." 
        })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const postComments = await Posts.findPostComments(req.params.id)

        console.log(postComments)

        if(postComments && postComments.length > 0) {
            res.status(200).json(postComments)
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist, or does not contain any comments."
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    }
})

module.exports = router 