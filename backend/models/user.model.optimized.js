import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true,    // ✅ Creates unique index
        index: true      // ✅ Additional index for faster lookups
    },
    fullName:{
        type:String,
        required:true,
        index: true      // ✅ Index for search functionality
    },
    email:{
        type:String,
        required:true,
        unique: true,    // ✅ Creates unique index
        lowercase: true  // ✅ Normalize email
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    
    // ✅ Correctly define as arrays of ObjectIds with indexing
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
        index: true     // ✅ Index for follower queries
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        default: [],
        index: true     // ✅ Index for following queries
    }],

    //not compulsory(optional) can set after signup
    profileImg:{
        type:String,
        default:"" //empty   
    },
    coverImg:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:"",
        index: 'text'   // ✅ Text search index for bio
    },
    link:{
        type:String,
        default:""
    },
     likedPosts: [//To see the posts user liked
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Post',
            default: [],
            index: true   // ✅ Index for liked posts queries
        },
    ]
},{
    timestamps: true    // ✅ Automatically indexed createdAt/updatedAt
})

// ============================================
// COMPOUND INDEXES (Schema Level)
// ============================================

// Compound index for username + email (for auth queries)
userSchema.index({ username: 1, email: 1 });

// Compound index for followers count optimization
userSchema.index({ followers: 1, createdAt: -1 });

// Text search index for user search functionality
userSchema.index({ 
    username: 'text', 
    fullName: 'text', 
    bio: 'text' 
}, {
    weights: {
        username: 10,  // Username more important
        fullName: 5,   // Full name medium importance  
        bio: 1         // Bio least important
    },
    name: 'user_search_text_idx'
});

const User = mongoose.model('User',userSchema)

export default User