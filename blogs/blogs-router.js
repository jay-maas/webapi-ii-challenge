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
        const post = await Posts.findById(req.params.id)
        console.log(post)
        if (!post.length) {
            res.status(404).json({
                message: "The post with the specified ID does not exist, or does not contain any comments."
            })
        } else {
        const postComments = await Posts.findPostComments(req.params.id)

        console.log(postComments)

        res.status(200).json(postComments)
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "The comments information could not be retrieved."
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const newPost = req.body
        const { title, contents } = newPost
        if(title && contents) {
            const addNewPost = await Posts.insert(newPost)
            res.status(201).json(addNewPost)
        } else {
            res.status(404).json({
                errorMessage: "Please provide title and contents for the post."
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "There was an error while saving the post to the database"
        })
    }
})

router.post('/:id/comments', async (req, res) => {
    try {
        if(req.body.text) {

            const post = await Posts.findById(req.params.id)

            const conditional = post.length > 0

            const newComment = {
                text: req.body.text,
                post_id: req.params.id
            }

            if(conditional) {
                const addNewComment = await Posts.insertComment(newComment)
                res.status(201).json(addNewComment)
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist."
                })
            }
        } else {
            res.status(400).json({
                errorMessage: "Please provide text for the comment." 
            })
        }

    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "There was an error while saving the comment to the database"
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)

        const conditional = post.length > 0

        if(conditional) {
            await Posts.remove(req.params.id)
            res.json({
                message: "Deleted"
            })
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "The post could not be removed"
        })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const updatedPost = {
            title: req.body.title,
            contents: req.body.contents
        }

        const post = await Posts.findById(req.params.id)

        const conditional = post.length > 0

        if (conditional) {
            if (updatedPost.title && updatedPost.contents) {
                const updatePost = await Posts.update(req.params.id, updatedPost)
                res.json({
                    message: "Post updated"
                })
            } else {
                res.status(400).json({
                    errorMessage: "Please provide title and contents for the post."
                })
            }
            
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist."
            })
        }
    } catch (error) {
        console.log(error)

        res.status(500).json({
            error: "The post information could not be modified."
        })
    }
})

module.exports = router 