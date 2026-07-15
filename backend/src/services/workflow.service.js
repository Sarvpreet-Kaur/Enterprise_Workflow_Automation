const { ROLES } = require("../constants/roles");
const Workflow = require("../models/workflowSchema");
const ApiError = require("../utils/ApiError");

exports.createWorkflow = async (data) => {

    // Check duplicate workflow name
    const existingWorkflow = await Workflow.findOne({
        name: data.name.trim()
    });
    if (existingWorkflow) {
        throw new ApiError( 409, "Workflow name already exists.");
    }

    // Steps cannot be empty
    if (!data.steps || data.steps.length === 0) {
        throw new ApiError( 400, "Workflow must contain at least one approval step."
        );
    }

    // Validate step order - inside workflow
    const orders = data.steps.map(step => step.order);
    const uniqueOrders = new Set(orders);

    if (orders.length !== uniqueOrders.size) {
        throw new ApiError(
            400,
            "Duplicate step order found."
        );
    }

    // Validate sequential order
    const sortedOrders = [...orders].sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length; i++) {
        if (sortedOrders[i] !== i + 1) {
            throw new ApiError( 400, "Workflow steps must be sequential starting from 1.");
        }
    }

    // Validate approver roles
    const validRoles = [ROLES.MANAGER, ROLES.ADMIN];
    for (const step of data.steps) {
        if (!validRoles.includes(step.approverRole)) {
            throw new ApiError(400, `Invalid approver role: ${step.approverRole}`);
        }
    }

    // Create Workflow
    const workflow = await Workflow.create(data);
    return workflow;
};

exports.getWorkflows = async() => {
    const workflows = await Workflow.find({isActive: true})
    .sort({ createdAt: -1 });

    return workflows;
}

exports.getWorkflowById = async (id) => {
    const workflow = await Workflow.findById(id);
    if (!workflow || !workflow.isActive) {
        throw new ApiError(404, "Workflow not found.");
    }
    return workflow;
};

exports.updateWorkflow = async (id, data) => {

    // Find workflow
    const workflow = await Workflow.findById(id);
    if (!workflow || !workflow.isActive) {
        throw new ApiError(404, "Workflow not found.");
    }
    // Duplicate name check
    if (data.name) {
        const existingWorkflow = await Workflow.findOne({name: data.name.trim(), _id: { $ne: id }});
        if (existingWorkflow) {
            throw new ApiError(409, "Workflow name already exists." );
        }
        workflow.name = data.name.trim();
    }

    // Description
    if (data.description !== undefined) {
        workflow.description = data.description;
    }
    // Update steps
    if (data.steps) {
        if (data.steps.length === 0) {
            throw new ApiError(400, "Workflow must contain at least one approval step.");
        }

        // Duplicate order validation
        const orders = data.steps.map(step => step.order);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
            throw new ApiError( 400, "Duplicate step order found.");
        }

        // Sequential validation
        const sortedOrders = [...orders].sort((a, b) => a - b);
        for (let i = 0; i < sortedOrders.length; i++) {
            if (sortedOrders[i] !== i + 1) {
                throw new ApiError(400, "Workflow steps must be sequential starting from 1.");
            }
        }

        // Valid approver roles
        const validRoles = ["manager", "admin"];
        for (const step of data.steps) {
            if (!validRoles.includes(step.approverRole)) {
                throw new ApiError(400, `Invalid approver role: ${step.approverRole}`);
            }
        }
        workflow.steps = data.steps;
    }

    await workflow.save();
    return workflow;
};

exports.deleteWorkflow = async(id)=>{
    const workflow = await Workflow.findById(id);
    if (!workflow || !workflow.isActive) {
        throw new ApiError(404, "Workflow not found.");
    }
    workflow.isActive = false
    await workflow.save()
    return workflow
}