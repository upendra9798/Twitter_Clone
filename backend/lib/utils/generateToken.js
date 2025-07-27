import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d'
    })
    // process.env.JWT_SECRET is a secret key used to sign
    //  the token (must be set in your .env file).

    res.cookie("jwt",token,{//jwt-Cookie name. token-JWT token being stored in the cookie.
        maxAge: 15*24*60*60*1000, //MS Lifespan of the cookie in milliseconds.(15 days)
        httpOnly:true, //Makes the cookie unreadable by JavaScript on 
        // the client side, preventing XSS attacks.
        sameSite: "strict",//Prevents the cookie from being sent with cross-site requests
        //  (helps prevent CSRF attacks).
        secure: process.env.NODE_ENV != "development",//Ensures the cookie is 
        // only sent over HTTPS in production.
    })
}