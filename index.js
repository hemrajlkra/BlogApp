const path = require('path');
const express = require('express');
const userRoute = require('./routes/User');
const app = express();
const mongoose = require('mongoose');

const port = 8000;
mongoose.connect('mongodb://localhost:27017/BlogApp')
    .then(()=>console.log("Connected to the database"))
    .catch((err)=>console.log(err));
app.set('view engine', 'ejs');
app.set('views',path.resolve("./views"));

app.use(express.urlencoded({extended:true})); // parse the form data
app.get("/", (req,res)=>{
    res.render('home');
});

app.use("/user", userRoute);// Registering the route :use the userRoute for all routes starting with /user
app.listen(port, ()=> console.log(`Server is running on port ${port}`));

//help me resolve this error TypeError: Router.use() requires a middleware function but got a Object
