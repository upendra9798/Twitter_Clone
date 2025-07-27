import express from 'express'
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'//Don't forget to use .js
import connectMongoDB from './db/connectMongoDB.js'
//as we are using type module

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// console.log(process.env.MONGO_URI);
app.use(express.json())  //to parse req.body
app.use(express.urlencoded({ extended: true })); // to parse form data

app.use("/api/auth",authRoutes)

app.listen(PORT,() => { 
    connectMongoDB()  
    console.log(`Server is running on port ${PORT}`);  
})  

