const router = require('express').Router();
const Blog = require('../models/Blog');
const { checkToken } = require('../middleware/middleware');

//* Create a new blog
router.route('/newblog').post(checkToken,async (req,res)=>{
    const { title, description, keywordone, keywordtwo, keywordthree, url } = req.body;
    try {
        const blog = await Blog.create({ title, description, keywordone, keywordtwo, keywordthree,username:req.user.username,url })
        res.send({ statusload:true, msg : "Blog created successfully",blog:blog})
    } catch (error) {
        console.log(error);
        res.send({ statusload:false, msg : "Unable to create a blog"})
    }
})


//* All blogs
router.route('/allblogs').get( async (req,res)=>{
    try {
        const blogs = await Blog.find();
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:[]})
    }
})

//* Get a single blog
router.route('/blog/:id').get( async (req,res)=>{
    const { id } = req.params;
    try {
        const blog = await Blog.findOne({ _id: id})
        res.send({statusload:true,blog:blog})
    } catch (error) {
        res.send({statusload:false,blog:{}})
    }
})

router.route('/comment/:id').post( checkToken,async (req,res)=>{
    const { id } = req.params;

    try {
        let blog = await Blog.updateOne({ _id :id }, {
            $push : {
                comments : {
                    username : req.user.username,
                    comment:req.body.comment
                }
            }
        })
        res.send({ statusload : true, comment : req.body.comment })
        
    } catch (error) {
        res.send({ statusload : false })
    }
})

//*Personal Blogs
router.route('/ownblogs').get(checkToken,async (req,res) => {
    try {
        let blogs = await Blog.find({ username : req.user.username })
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:{} })
    }
})


//* Blogs that i commented on
router.route('/commentedblogs').get(checkToken,async (req,res) => {
    try {
        let blogs = await Blog.find({ "comments" : { "username": req.user.username }})
        res.send({ statusload:true,blogs:blogs })
    } catch (error) {
        res.send({ statusload:false,blogs:{} })
    }
})

//* Check whether the user is allowed to edit the blog or not or not
router.route('/editcheck/:id').get(checkToken,async (req,res)=>{
    const { id } = req.params;
    const blog = await Blog.findOne({ _id:id, username: req.user.username });
    if(blog){
        return res.send({ statusload : true, blog:blog })
    }
    return res.send({ statusload : false })
})

//* Edit blog
router.route('/blog/edit/:id').put(checkToken,async (req,res) => {
    const { title, description, keywordone, keywordtwo, keywordthree, url } = req.body;
    try {
        const blog = await Blog.updateOne({ _id: req.params.id },{ title, description, keywordone, keywordtwo, keywordthree, url, username: req.user.username })
        res.send({ statusload: true, msg: "Blog Edited Successfully", blog:{ title, description, keywordone, keywordtwo, keywordthree, url} })
    } catch (error) {
        console.log(error);
        res.send({ statusload: false })
    }
})

//* Delete blog
router.route('/blog/delete/:id').delete(checkToken, async (req,res) => {
    try {
        let blog = await Blog.findByIdAndDelete({_id : req.params.id })
        res.send({ statusload:true})
    } catch (error) {
        console.log(error)
        res.send({ statusload:false})
    }
})

module.exports = router;