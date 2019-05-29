const express = require('express')

const blogsRouter = require('../blogs/blogs-router.js')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.send(`
    <h2>Jay's Blog API</h2>
    <p>Welcome to my blogs API</p>
    `)
})

server.use('/api/posts', blogsRouter)

module.exports = server