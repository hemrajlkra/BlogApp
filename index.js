const path = require('path');
const express = require('express');
const userRoute = require('./routes/User');
const blogRoute = require('./routes/blog');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authentication');

const port = 8000;
mongoose.connect('mongodb://localhost:27017/BlogApp')
    .then(()=>console.log("Connected to the database"))
    .catch((err)=>console.log(err));
app.set('view engine', 'ejs');
app.set('views',path.resolve("./views"));

app.use(express.urlencoded({extended:true})); // parse the form data
app.use(cookieParser()); // parse the cookies in the request headers
app.use(checkForAuthenticationCookie('_uid')); // check for the authentication cookie
app.get("/", (req,res)=>{
    res.render('home',{
        user:req.user
    });
});

app.use("/user", userRoute);// Registering the route :use the userRoute for all routes starting with /user
app.use("/blog", blogRoute);// Register the blog router
app.listen(port, ()=> console.log(`Server is running on port ${port}`));

//help me resolve this error TypeError: Router.use() requires a middleware function but got a Object
