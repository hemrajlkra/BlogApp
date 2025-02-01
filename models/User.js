const{Schema, model} = require('mongoose');
// import the crypto module to hash the password
const {createHmac,randomBytes} = require('crypto');

const userSchema = new Schema(
    {
        name:{
            type:String,
            required:[true, "Name is required"],
        },
        email:{
            type:String,
            required: true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        salt:{
            type:String,
        },
        profilePic:{
            type:String,
            default:'/images/default.jpg'
        },
        role:{
            type:String,
            enum:["ADMIN","USER"],
            default:"USER"
        }
    },
    {timestamps:true}
);
// pre save hook to hash the password before saving it to the database
userSchema.pre('save', function(next){
    const user=this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    // hash the password with the salt value
    const hashedPassword = createHmac('sha256',salt)
    .update(user.password)
    .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();
});

// static method to match the password with the hashed password in the database 
// this is mongoose virtual function that checks when the user signin if the password is correct
userSchema.static("matchPassword", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");
    const hashedPassword = user.password;
    const salt = user.salt;

    const userProvidedHash= createHmac('sha256',salt)
    .update(password)
    .digest("hex");

    if(userProvidedHash !== hashedPassword)
        throw new Error("Password is incorrect");

    return user;
})

const User = model('User', userSchema);
module.exports = User;