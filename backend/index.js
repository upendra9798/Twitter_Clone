import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import path from "path";
import fs from "fs";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Correct CORS setup
app.use(cors({
  origin: [
    "https://twitter-clone-pink-six.vercel.app", // Vercel frontend
    "http://localhost:5173"                     // Local dev
  ],
  credentials: true, // Allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Handle preflight OPTIONS
app.options("*", cors({
  origin: [
    "https://twitter-clone-pink-six.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const distDir = path.join(__dirname, "../frontend/dist");
  const indexHtml = path.join(distDir, "index.html");

  if (fs.existsSync(indexHtml)) {
    app.use(express.static(distDir));
    app.get('*', (req, res) => res.sendFile(indexHtml));
  } else {
    console.warn(`Frontend build not found at ${indexHtml}`);
    app.get("/", (req, res) => res.status(200).send("API is running, frontend build not found."));
  }
}

app.listen(PORT, () => { 
  connectMongoDB();  
  console.log(`Server is running on port ${PORT}`);  
});
