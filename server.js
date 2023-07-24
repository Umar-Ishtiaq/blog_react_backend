const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') //cors is for cross origin requests otherwise the browser will block the requests. Cross origin requests happen from one client to another like in our case from react(frontend) to backend
require('dotenv').config()
const app = express()

//middleware anything mediating between request and response
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log("Connected to DB"))
    .catch((error)=>console.log(error))

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    content: String
})

const Post = mongoose.model('Post', postSchema)

//get all posts
app.get('/posts', async(req, res)=> {
    const posts = await Post.find()
    res.send(posts)
})

//get one post
app.get('/posts/:id', async(req,res)=> {
    const post = await Post.findById(req.params.id)
    res.send(post)
})

//create new post
app.post('/posts', async(req,res)=>{
    const newPost = new Post(req.body)
    const savedPost = await newPost.save()
    res.send(savedPost)
})

//delete post
app.delete('/posts/:id', async (req,res)=> {
    await Post.findByIdAndRemove(req.params.id)
    res.status(200).send('Post Deleted')
})

app.listen(process.env.PORT, ()=>console.log('Server running on Port 3500'))