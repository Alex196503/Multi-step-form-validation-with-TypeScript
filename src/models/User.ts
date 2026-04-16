import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Your name is required"]
    },
    email : {
        type : String,
        unique : true,
        required: [true, "Email is required"],
        lowercase : true,
        trim : true
    },
    phone: {
        type : String,
        required : [true, "Phone is required"]
    },
    password:{
        type : String,
        required: [true, "Password is required"]    
    },
    createdAt:{
        type : Date,
        default: Date.now
    }
})
export let UserModel = mongoose.model('User', UserSchema);