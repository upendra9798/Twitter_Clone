import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index: true     // ✅ Index for user's posts queries
    },
    text:{
        type:String,
        index: 'text'   // ✅ Text search index
    },
    img:{
        type:String
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            index: true   // ✅ Index for likes queries
        }
    ],
    comments:[
        {
            text:{
                type:'String',
                required:true,
                index: 'text'  // ✅ Text search for comments
            },
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true,
                index: true    // ✅ Index for comment author queries
            },
            createdAt: {
                type: Date,
                default: Date.now,
                index: true    // ✅ Index for comment timeline
            }
        }
    ],
},{
    timestamps:true    // ✅ Automatically indexed createdAt/updatedAt
})

// ============================================
// COMPOUND INDEXES (Schema Level)
// ============================================

// Most important: User + Creation time for user timeline
postSchema.index({ user: 1, createdAt: -1 });

// Global timeline index
postSchema.index({ createdAt: -1 });

// Posts with images (for media queries)
postSchema.index({ img: 1, createdAt: -1 });

// Likes count optimization (for trending posts)
postSchema.index({ 'likes.length': -1, createdAt: -1 });

// User + likes for user's liked posts
postSchema.index({ user: 1, likes: 1 });

// Text search across post content
postSchema.index({ 
    text: 'text',
    'comments.text': 'text'
}, {
    weights: {
        text: 10,           // Post text more important
        'comments.text': 3  // Comments less important
    },
    name: 'post_content_search_idx'
});

// Comments timeline per post
postSchema.index({ '_id': 1, 'comments.createdAt': -1 });

const Post = mongoose.model("Post",postSchema)

export default Post