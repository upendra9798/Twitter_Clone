import express from 'express'
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'//Don't forget to use .js //as we are using type module 
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'

import connectMongoDB from './db/connectMongoDB.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary';

dotenv.config()

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express()
const PORT = process.env.PORT || 5000

// console.log(process.env.MONGO_URI);
app.use(express.json())  //to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data

app.use(cookieParser()); //For protectRoute middelware

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)

app.listen(PORT,() => { 
    connectMongoDB()  
    console.log(`Server is running on port ${PORT}`);  
})  

