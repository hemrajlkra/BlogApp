const { Router } = require('express');
const User = require('../models/User');

const router = Router();

router.get('/signup',(req,res)=>{
    res.render('signup');
});

router.get('/signin',(req,res)=>{
    res.render('signin');
});

router.post('/signup',async (req,res)=>{
    const {name,email,password} = req.body;
    await User.create({name,email,password});
    res.redirect('/'); // redirect to the home page
});

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.matchPassword(email,password);
    return res.redirect('/');
})
module.exports = router;