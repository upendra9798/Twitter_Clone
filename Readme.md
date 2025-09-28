# 🐦 Twitter Clone

[![Made with React](https://img.shields.io/badge/Made_with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack Twitter clone showcasing modern web development practices and real-time interactions. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time updates and a responsive UI.

## 🚀 Quick Start

### Requirements

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/upendra9798/twitter_clone.git
cd twitter_clone
```

1. Configure environment variables:

Backend (create `.env` in backend folder):

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Frontend (create `.env` in frontend folder):

```env
VITE_API_BASE_URL=http://localhost:5000
```

1. Install dependencies and run servers:

```bash
# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

1. Visit [http://localhost:5173](http://localhost:5173) in your browser

## 🌟 Main Features

### Authentication & Security

- ✅ JWT-based authentication with HTTP-only cookies
- 🔒 Secure password hashing with bcrypt
- 🛡️ Protected routes with middleware
- 🚪 User signup, login, and logout functionality

### Profile Features

- 👤 Customizable profile with picture and banner
- ✏️ Edit profile information
- 📊 Track following/followers
- 🖼️ Cloudinary integration for image uploads

### Post Management

- 📝 Create and delete posts
- 🖼️ Image attachments in posts
- 💬 Comment on posts
- ❤️ Like/Unlike functionality
- 🔄 Repost capability

### Social Features

- 👥 Follow/Unfollow users
- 🔔 Real-time notifications
- 🎯 Suggested users
- 💭 Interactive comments

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI library
- **TailwindCSS** - Styling
- **React Query** - Server state management
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting

## 🚀 Installation Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 💡 Implementation Details

### Authentication Flow

- JWT-based authentication using HTTP-only cookies
- Protected routes using custom middleware
- Secure password hashing with bcrypt
- Token-based session management

### Data Models

1. User Model:
   - Profile information
   - Following/Followers relationships
   - Authentication details

2. Post Model:
   - Text content
   - Image attachments
   - Likes and comments
   - Timestamps

3. Notification Model:
   - User interactions
   - System notifications
   - Read/Unread status

### API Integration

- React Query for efficient data fetching and caching
- Axios for HTTP requests
- Real-time updates using React Query's invalidation

## 🔒 Security Features

- HTTP-only cookies for JWT
- Password hashing
- Protected API routes
- CORS configuration
- Input validation

## 🎯 Future Enhancements

- [ ] Real-time chat
- [ ] Tweet bookmarks
- [ ] Tweet analytics
- [ ] Media attachments
- [ ] Advanced search

## 📝 License

This project is open source and available under the MIT License.

---

Created with ❤️ by [Upendra Kushwaha](https://github.com/upendra9798)