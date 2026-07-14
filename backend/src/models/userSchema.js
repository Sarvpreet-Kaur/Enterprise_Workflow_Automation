const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type:String, 
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName: {
        type:String, 
        required: true,
        minLength:3,
        maxLength:20
    },
    email: {
        type:String, 
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        lowercase: true
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
        type: String,
        enum: ["Engineering", "HR", "Finance", "Operations", "IT"]
    },
    isActive:{
        type: Boolean,
        default: true
    },
    photo:{
        type: String,
        default: "This is the default photo"
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    }]
}, {timestamps: true});

const user = mongoose.model("User", userSchema);
module.exports = user;