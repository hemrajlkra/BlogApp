const { Router, response } = require('express');
const path = require('path');
const multer = require('multer');
const blog = require('../models/blog');
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/Images/uploads`));
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
router.get('/:id', async(req,res)=>{
    const singleBlog = await blog.findById(req.params.id).populate('createdBy');
    console.log(singleBlog);
    return res.render('blogPage',{
      user:req.user,
      singleBlog
    });  
})

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