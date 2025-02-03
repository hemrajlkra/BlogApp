const JWT = require('jsonwebtoken');

const secret = "ThisIs@SecretK3Y";

function CreateToken(user){
    const payload = {
        _id : user._id,
        email : user.email,
        profilePic : user.profilePic,
        role : user.role
    }
    const token = JWT.sign(payload,secret);
    return token;
}

function VerifyToken(token){
    return JWT.verify(token,secret);
}


module.exports = {
    CreateToken,
    VerifyToken
}