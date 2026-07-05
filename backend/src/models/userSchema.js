const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type:String, 
        required: true,
        minLength:3,
        maxLength:20
    },
    emailId: {
        type:String, 
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        lowercase: true
    },
    age: {
        type: Number,
        min:5,
        max:90
    },
    role: {
        type: String,
        enum :['employee','manager', 'admin'],
        default: 'employee',
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department:{
        type: String
    },
    isActive:{
        type: String
    },
    photo:{
        type: String,
        default: "This is the default photo"
    }
}, {timestamps: true});

const user = mongoose.model("user", userSchema);
module.exports = user;