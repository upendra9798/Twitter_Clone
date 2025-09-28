# 🐦 Twitter Clone

[![Made with React](https://img.shields.io/badge/Made_with-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A full-stack Twitter clone showcasing modern web development practices and real-time interactions. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring real-time updates and a responsive UI.

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Node.js/      │◄──►│   (MongoDB)     │
│                 │    │    Express)      │    │                 │
│ • Components    │    │ • REST API       │    │ • User          │
│ • React Query   │    │ • Auth Middleware│    │ • Post          │
│ • TailwindCSS   │    │ • JWT Tokens     │    │ • Notification  │
│ • React Router  │    │ • File Upload    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   Third Party    │
                    │   Services       │
                    │                  │
                    │ • Cloudinary     │
                    │   (Image Host)   │
                    └──────────────────┘
```

### Architecture Layers

#### 1. **Presentation Layer (Frontend - React.js)**
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Post, Posts, Sidebar)
│   ├── skeletons/       # Loading placeholders
│   └── svgs/            # SVG icons and graphics
├── pages/               # Route-based page components
│   ├── auth/           # Login, Signup pages
│   ├── home/           # Home feed and CreatePost
│   ├── profile/        # User profile pages
│   └── notification/   # Notifications page
├── hooks/              # Custom React hooks
│   ├── useFollow.jsx   # Follow/Unfollow logic
│   ├── useMutations.js # API mutations
│   └── useQueries.js   # Data fetching hooks
├── utils/              # Utility functions
│   └── api.js          # API configuration
└── App.jsx             # Main app component with routing
```

**Key Features:**
- **Component-Based Architecture**: Modular, reusable components
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: React Router for SPA navigation
- **Styling**: TailwindCSS with DaisyUI components
- **Real-time Updates**: Optimistic updates with React Query invalidation

#### 2. **Application Layer (Backend - Node.js/Express)**
```
backend/
├── controllers/         # Business logic handlers
│   ├── auth.controller.js      # Authentication logic
│   ├── user.controller.js      # User management
│   ├── post.controller.js      # Post operations
│   └── notification.controller.js # Notifications
├── middleware/          # Custom middleware
│   └── protectRoute.js  # JWT authentication
├── models/             # Database schemas (Mongoose)
│   ├── user.model.js   # User data structure
│   ├── post.model.js   # Post data structure
│   └── notification.model.js # Notification structure
├── routes/             # API route definitions
│   ├── auth.routes.js  # Auth endpoints
│   ├── user.routes.js  # User endpoints
│   ├── post.routes.js  # Post endpoints
│   └── notification.routes.js # Notification endpoints
├── lib/utils/          # Utility functions
│   └── generateToken.js # JWT token generation
├── db/                 # Database configuration
│   └── connectMongoDB.js # MongoDB connection
└── index.js            # Express server setup
```

**Key Features:**
- **RESTful API Design**: Clean, resource-based endpoints
- **Middleware Chain**: Authentication, CORS, body parsing
- **MVC Pattern**: Separation of routes, controllers, and models
- **Error Handling**: Centralized error management
- **Security**: JWT tokens, bcrypt hashing, CORS configuration

#### 3. **Data Layer (MongoDB)**
```
Database Collections:
├── users               # User profiles and authentication
│   ├── _id, username, email, password (hashed)
│   ├── fullName, followers[], following[]
│   ├── profileImg, coverImg (Cloudinary URLs)
│   └── bio, link, createdAt, updatedAt
├── posts               # User posts/tweets
│   ├── _id, user (ObjectId ref), text, img
│   ├── likes[] (ObjectId refs), comments[]
│   └── createdAt, updatedAt
└── notifications       # User notifications
    ├── _id, from (ObjectId), to (ObjectId), type
    ├── read (boolean), post (ObjectId ref)
    └── createdAt
```

### Data Flow Architecture

#### 1. **Authentication Flow**
```
User Login Request → Express Route → Auth Controller → 
Password Verification (bcrypt) → JWT Generation → 
HTTP-Only Cookie → Protected Route Access
```

#### 2. **Post Creation Flow**
```
Frontend Form → Image Upload (Cloudinary) → 
API Request (with JWT) → Post Controller → Database Save → 
React Query Cache Invalidation → UI Re-render
```

#### 3. **Real-time Updates Flow**
```
User Action → Optimistic Update → API Call → 
Database Update → React Query Invalidation → 
Background Refetch → UI Sync
```

### API Architecture

#### RESTful Endpoints Structure
```
/api/auth/*             # Authentication routes
├── POST /signup        # User registration
├── POST /login         # User login
├── POST /logout        # User logout
└── GET /me             # Get current user

/api/users/*            # User management
├── GET /profile/:username    # Get user profile
├── GET /suggested           # Get suggested users
├── POST /follow/:id         # Follow/unfollow user
└── POST /update             # Update profile

/api/posts/*            # Post management
├── GET /all            # Get all posts (feed)
├── GET /following      # Get posts from following
├── GET /likes/:id      # Get user's liked posts
├── GET /user/:username # Get user's posts
├── POST /create        # Create new post
├── POST /like/:id      # Like/unlike post
├── POST /comment/:id   # Comment on post
└── DELETE /:id         # Delete post

/api/notifications/*    # Notification system
├── GET /              # Get user notifications
└── DELETE /           # Delete all notifications
```

### Security Architecture

#### Authentication & Authorization
- **JWT Tokens**: Stored in HTTP-only cookies for XSS protection
- **Password Security**: Bcrypt hashing with salt rounds
- **Route Protection**: Middleware-based authentication checks
- **CORS Policy**: Configured for cross-origin requests with credentials

#### Data Security
- **Input Validation**: Mongoose schema validation
- **File Upload Security**: Cloudinary integration with type/size limits
- **Environment Variables**: Sensitive data stored securely
- **Error Handling**: Sanitized error messages to prevent information leakage

### Deployment Architecture

```
Development Environment:
Frontend (Vite - localhost:5173) ←→ Backend (Node.js - localhost:5000) ←→ MongoDB (Local/Atlas)

Production Environment:
Frontend (Vercel) ←→ Backend (Render) ←→ MongoDB Atlas
                           ↓
                    Cloudinary (Image CDN)
```

### Performance Optimizations

#### Frontend Optimizations
- **React Query Caching**: Automatic data caching and synchronization
- **Code Splitting**: Route-based lazy loading with React Router
- **Image Optimization**: Cloudinary transformations and lazy loading
- **Bundle Optimization**: Vite's optimized build process

#### Backend Optimizations
- **Database Indexing**: MongoDB indexes on frequently queried fields
- **Middleware Efficiency**: Optimized request processing pipeline
- **Error Handling**: Proper HTTP status codes and structured responses
- **CORS Configuration**: Environment-specific origin configurations

#### Database Design Patterns
- **Document References**: User references in posts and notifications
- **Embedded Documents**: Comments embedded within posts
- **Indexing Strategy**: Indexes on username, email, and timestamps
- **Data Relationships**: Proper foreign key relationships using ObjectIds

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
MONGODB_URI=mongodb_uri
JWT_SECRET=jwt_secret
CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
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