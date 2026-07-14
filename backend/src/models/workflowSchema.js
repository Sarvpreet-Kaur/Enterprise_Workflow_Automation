const mongoose = require('mongoose');
const {Schema} = mongoose;

const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    steps: [{
        order: {
            type: Number,
            required: true
        },
        approverRole: {
            type: String,
            enum: ["manager", "admin"],
            required: true
        },
        canReject: {
            type: Boolean,
            default: true
        }
    }]
},{ timestamps: true});

const workflow = mongoose.model("Workflow", workflowSchema);
module.exports = workflow;