const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        enum: ["Engineering", "HR", "Finance", "Operations", "IT"]
    },

    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Team", teamSchema);