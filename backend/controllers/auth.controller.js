import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {generateTokenAndSetCookie} from '../lib/utils/generateToken.js'

export const signup = async (req,res) => {
    try {
       const {fullName,email,username,password} = req.body;

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if(!emailRegex.test(email)){
        return res.status(400).json({error:"Invalid email format"})
       }

       const existingUser = await User.findOne({username})
       if(existingUser){
        return res.status(400).json({error:"Username is already taken"})
       }

       const existingEmail = await User.findOne({email})
       if(existingEmail){
        return res.status(400).json({error:"Email is already taken"})
       }

       if(password.length<6){
        return res.status(400).json({error:"Password must be at least 6 characters long"})
       }

       //hash Password
       const salt = await bcrypt.genSalt(10); 
       const hashPassword = await bcrypt.hash(password,salt)
    //    bcrypt.genSalt(10) generates a salt with 10 rounds.
// A salt is a random string added to the password before hashing,
//  to protect against rainbow table attacks.
// 10 is the cost factor: higher means more secure but slower. 
// 10 is a good default.

       const newUser = new User({
        username,
        fullName,
        email,
        password:hashPassword
       })

       if(newUser){
        generateTokenAndSetCookie(newUser._id,res)
        await newUser.save();

        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            username:newUser.username,
            email:newUser.email,
            following:newUser.following,
            followers:newUser.followers,
            profileImg:newUser.profileImg,
            coverImg:newUser.coverImg
        })
       } else{
        res.status(400).json({error:"Invalid user data"})
       }
    } catch (error) {
        console.log("Error in sign up controller",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}
export const login = async (req,res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")
        if(!user || !isPasswordCorrect) {
return res.status(400).json({error: "Invalid username or password"})
}
generateTokenAndSetCookie(user._id,res);

res.status(200).json({
_id: user._id,
fullName: user.fullName,
username: user.username,
email: user.email,
followers: user.followers,
following: user.following,
profileImg: user.profileImg,
coverImg: user.coverImg,
});
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Internal server error"})
    }
}
export const logout = async (req,res) => {
    try {
       res.cookie("jwt","",{maxAge:0})
       res.status(200).json({message:"Logged out successfully"})
//        The first parameter "jwt" is the name of the cookie.
// The second parameter "" sets the cookie value to an empty string.
// { maxAge: 0 } tells the browser to immediately expire the cookie.
       //No JWT is present → request is unauthenticated → user is treated as logged out.
    } catch (error) {
        console.log("Error in logout controller",error.message);
        res.status(500).json({error:"Internal Server Error"})        
    }
}

export const getMe = async (req,res) => {
    try {
        const user = await User.findOne(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in getMe controller",error.message);
        res.status(500).json({error:"Internal Server Error"})  
    }
}