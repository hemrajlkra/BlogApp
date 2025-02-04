const { VerifyToken } = require('../services/authentication');
function checkForAuthenticationCookie(cookieName) {
    return (req,res, next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload = VerifyToken(tokenCookieValue);
            req.user=userPayload;
        }
        catch(err){
        }
        return next();
    }
}

module.exports = {
    checkForAuthenticationCookie
};