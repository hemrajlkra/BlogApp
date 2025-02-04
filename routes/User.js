const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/signin',(req,res)=>{
    res.render('signin');
});
router.get('/signout',(req,res)=>{
    res.clearCookie("_uid").redirect('/');
});

router.post('/signup',async (req,res)=>{
    const {name,email,password} = req.body;
    await User.create({name,email,password});
    res.redirect('/'); // redirect to the home page
});

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);
        return res.cookie("_uid",token).redirect('/');
    }
    catch(err){
        return res.status(401).render('signin',{error:err.message});
    }
})
module.exports = router;