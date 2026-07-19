const mongoose = require('mongoose');
const {Schema} = mongoose;
const workflow = require('./workflowSchema');

const requestSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    workflow: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workflow",
        required: true
    },

    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },

    status: {
        type: String,
        enum: [
            "Draft",
            "Pending",
            "Approved",
            "Rejected",
            "Cancelled"
        ],
        default: "Draft"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },

    currentApprover: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    currentStep: {
        type: Number
    },
    approvalHistory: [{
        step: Number,
        approver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String,
            enum: ["manager", "admin"]
        },
        action: {
            type: String,
            enum: ["Approved", "Rejected"]
        },
        comments: String,
        actionAt: {
            type: Date,
            default: Date.now
        }
    }],
    submittedAt: Date
}, {timestamps: true});

const request = mongoose.model("Request", requestSchema);
module.exports = request;