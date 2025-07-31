import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    // followers:{
    //     type:mongoose.Schema.Types.ObjectId, //at least len of 16
    //     ref:"User",
    //     default:[]  //0 followers of the user
    // },
    // following:{
    //     type:mongoose.Schema.Types.ObjectId, //at least len of 16
    //     ref:"User",
    //     default:[]  //0 followers of the user
    // },
    
//    ⚠️ “followers is a single ObjectId, and its default is an array.”
//  That's invalid. You can't assign an array ([]) as the default to a
//  field that's supposed to hold a single value (ObjectId).
     // ✅ Correctly define as arrays of ObjectIds
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
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
        default:""
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
        },
    ]
},{timestamps: true})

const User = mongoose.model('User',userSchema)

export default User