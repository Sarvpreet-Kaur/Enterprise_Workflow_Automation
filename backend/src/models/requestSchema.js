const mongoose = require('mongoose');
const {Schema} = mongoose;
import workflow from './workflowSchema';

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
    submittedAt: Date
}, {timestamps: true});

const request = mongoose.model("Request", requestSchema);
module.exports = request;