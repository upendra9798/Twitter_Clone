import express from 'express'
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'//Don't forget to use .js //as we are using type module 
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.routes.js'
import notificationRoutes from './routes/notification.routes.js'

import connectMongoDB from './db/connectMongoDB.js'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary';
import path from "path";

dotenv.config()

cloudinary.config({
cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
api_key: process.env.CLOUDINARY_API_KEY,
api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve();

// console.log(process.env.MONGO_URI);
app.use(express.json({limit:"5mb"}))  //to parse req.body
//limit shouldn't be too high to prevent DOS(img upload)
app.use(express.urlencoded({ extended: true })); // to parse form data

app.use(cookieParser()); //For protectRoute middelware

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)

// if (process.env.NODE_ENV === "production") {
//    //NOTE:- WRONG BECAUSE IT IS WHEN PACKAGE IS OUTSIDE BACKEND FOLDER

// //     app.use(express.static(path.join(__dirname, "/frontend/dist")));
// // res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));

// 	app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get(/.*/, (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
// });
// }
if (process.env.NODE_ENV === "production") {
	const distDir = path.join(__dirname, "../frontend/dist");
	const indexHtml = path.join(distDir, "index.html");

	if (fs.existsSync(indexHtml)) {
		app.use(express.static(distDir));
		app.get(/.*/, (req, res) => {
			res.sendFile(indexHtml);
		});
	} else {
		console.warn(`Frontend build not found at ${indexHtml}. Skipping static serving.`);
		app.get("/", (req, res) => {
			res.status(200).send("API is running, frontend build not found.");
		});
	}
}

app.listen(PORT,() => { 
    connectMongoDB()  
    console.log(`Server is running on port ${PORT}`);  
})  

