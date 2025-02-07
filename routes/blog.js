const { Router, response } = require('express');
const path = require('path');
const multer = require('multer');
const blog = require('../models/blog');
const coment = require('../models/comment');
const user = require('../models/User');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null,fileName);
    }
});
const upload = multer({ storage: storage })
router.get("/add-new",(req,res)=>{
    return res.render('addBlog',{user:req.user});
});

// To render the specific blog on readmore we create a get route
router.get('/:id', async (req,res)=>{
    const singleBlog = await blog.findById(req.params.id).populate('createdBy');
    const coments =  await coment.find({blogId: req.params.id}).populate('createdBy');
    //const coments = await coment.find({}).populate('createdBy');
    return res.render('blogPage',{
      user : req.user,
      singleBlog,
      coments
    });  
});

router.post('/comment/:blogId', async (req,res)=>{
    await coment.create({
      content:req.body.content,
      createdBy:req.user._id,
      blogId: req.params.blogId
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/",upload.single('coverImage'), async (req,res)=>{
    const {title,body} = req.body;
    const blogContent =await blog.create({
        body,
        title,
        createdBy : req.user._id,
        coverImage: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blogContent._id}`);
})
module.exports = router;