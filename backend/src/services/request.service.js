const User = require('../models/userSchema')
const Team = require('../models/teamSchema')
const Workflow = require('../models/workflowSchema')
const ApiError = require('../utils/apiError')
const {ROLES} = require('../constants/roles')
const Request = require('../models/requestSchema')

const findLoggedInUser = async(id)=>{
    const user = await User.findById(id);
    if (!user || !user.isActive) {
        throw new ApiError(404, "User not found");
    }
    return user
}

const findWorkflow = async(id)=>{
    const workflow = await Workflow.findById(id);
    if (!workflow || !workflow.isActive) {
        throw new ApiError(404, "Workflow not found");
    }
    return workflow
}

const resolveApprover = (user, team, workflow) => {
    for (const step of workflow.steps) {
        // Skip approval if requester already has this role
        if (step.approverRole === user.role) {
            continue;
        }
        switch (step.approverRole) {
            case ROLES.MANAGER:
                return {
                    currentStep: step.order,
                    currentApprover: team.manager
                };
            case ROLES.ADMIN:
                return {
                    currentStep: step.order,
                    currentApprover: team.admin
                };
            default:
                throw new ApiError(400, "Invalid workflow configuration.");
        }
    }
    throw new ApiError(400, "No approver found for this workflow.");
};

const findTeam = async (user, body) => {
    // Employee
    if (user.role === ROLES.EMPLOYEE) {
        if (!user.teams.length) {
            throw new ApiError(400, "Employee is not assigned to a team.");
        }

        const team = await Team.findById(user.teams[0]);
        if (!team || !team.isActive) {
            throw new ApiError(404, "Team not found.");
        }
        return team;
    }

    // Manager
    if (user.role === ROLES.MANAGER) {
        if (!body.team) {
            throw new ApiError(400, "Team is required.");
        }
        const exists = user.teams.some(
            teamId => teamId.toString() === body.team
        );

        if (!exists) {
            throw new ApiError(403, "Manager is not assigned to this team.");
        }
        const team = await Team.findById(body.team);
        if (!team || !team.isActive) {
            throw new ApiError(404, "Team not found.");
        }
        return team;
    }

    throw new ApiError(403, "Admins cannot create requests.");
};

const resolveNextApprover = (team, workflow, currentStep) => {
    console.log(workflow.steps);
    console.log(currentStep);
    const nextStep = workflow.steps.find(step => {
        console.log(step.order);
        return step.order === currentStep + 1;
    });

    console.log(nextStep);
    if (!nextStep) {
        return null;
    }
    switch(nextStep.approverRole){
        case ROLES.MANAGER:
            return {
                currentStep: nextStep.order,
                currentApprover: team.manager
            };
        case ROLES.ADMIN:
            return {
                currentStep: nextStep.order,
                currentApprover: team.admin
            };
        default:
            throw new ApiError(400, "Invalid workflow configuration.");
    }
}

exports.createRequest = async(req, res)=>{
    console.log(req)
    const body = req.body
    const user = await findLoggedInUser(req.user._id)
    const workflow = await findWorkflow(body.workflow)
    const team = await findTeam(user, body)

    const request =
        await Request.create({
            title: body.title,
            description: body.description,
            workflow: workflow._id,
            team: team._id,
            priority: body.priority,
            createdBy: user._id,
            status: "Draft"
        });

    return request;
};

exports.updateRequest = async (req) => {

    const body = req.body;
    const request = await Request.findById(req.params.id);
    if (!request || request.status === "Cancelled") {
        throw new ApiError(404, "Request not found.");
    }
    if (request.createdBy.toString() !== req.user._id) {
        throw new ApiError(403, "Access denied.");
    }
    if (request.status !== "Draft") {
        throw new ApiError(400, "Only draft requests can be updated.");
    }
    if (body.workflow) {
        const workflow = await findWorkflow(body.workflow);
        request.workflow = workflow._id;
    }
    if (body.title) request.title = body.title;
    if (body.description) request.description = body.description;
    if (body.priority) request.priority = body.priority;
    await request.save();
    return request;
};

exports.submitRequest = async (req) => {
    const request = await Request.findById(req.params.id);
    if (!request || request.status === "Cancelled") {
        throw new ApiError(404, "Request not found.");
    }
    if (request.createdBy.toString() !== req.user._id) {
        throw new ApiError(403, "Access denied.");
    }
    if (request.status !== "Draft") {
        throw new ApiError(400, "Request is already submitted.");
    }
    const user = await findLoggedInUser(req.user._id);
    const workflow = await findWorkflow(request.workflow);
    const team = await Team.findById(request.team);
    const approval = await resolveApprover( user, team, workflow );

    request.status = "Pending";
    request.currentApprover = approval.currentApprover;
    request.currentStep = approval.currentStep;
    request.submittedAt = new Date();
    await request.save();
    return request;
};

exports.getRequests = async (req) => {
    const search = req.query.search;
    const status = req.query.status;
    const workflow = req.query.workflow;
    const priority = req.query.priority;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit;
    let query = {};
    if (req.user.role !== ROLES.ADMIN) {
        query.createdBy = req.user._id;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" }}
        ];
    }
    if(workflow && workflow!==''){
        query.workflow = workflow
    }

    if(priority && priority!==''){
        query.priority = priority
    }

    if(status !== undefined && status!==''){
        query.status = status
    }
    const requests = await Request.find(query)
            .populate("workflow", "name")
            .populate("team", "name")
            .populate(
                "currentApprover",
                "firstName lastName"
            );
    const totalRecords = await Request.countDocuments(query);
    const totalPages = Math.ceil(totalRecords/limit);
    return ({
        data: requests,
        pagination: {
            totalRecords,
            currentPage: page,
            totalPages,
            pageSize: limit
        }
    });
};

exports.getRequestById = async (req) => {
    const request =
        await Request.findById(req.params.id)
            .populate("workflow")
            .populate("team")
            .populate("createdBy")
            .populate("currentApprover")
            .populate("approvalHistory.approver", "firstName lastName");
    if (!request || request.status === "Cancelled") {
        throw new ApiError(
            404,
            "Request not found."
        );
    }
    const isOwner = request.createdBy._id.toString() === req.user._id;
    const isApprover = request.currentApprover && request.currentApprover._id.toString() === req.user._id;
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isOwner && !isApprover && !isAdmin) {
        throw new ApiError( 403, "Access denied.");
    }
    return request;
};

exports.cancelRequest = async (req) => {
    const request = await Request.findById(req.params.id);
    if (!request || request.status === "Cancelled") {
        throw new ApiError(404, "Request not found.");
    }
    if (request.createdBy.toString() !== req.user._id) {
        throw new ApiError(403, "Access denied.");
    }
    if (request.status !== "Pending") {
        throw new ApiError( 400, "Only pending requests can be cancelled.");
    }
    request.status = "Cancelled";
    request.completedAt = new Date();
    await request.save();
    return request;
};

exports.getPendingRequests = async (req) => {

    return await Request.find({
        currentApprover: req.user._id,
        status: "Pending"
    })
    .populate("createdBy","firstName lastName")
    .populate("workflow","name")
    .populate("team","name department")
    .populate("approvalHistory.approver", "firstName lastName");
}

exports.approveRequest = async(req)=>{
    const request = await Request.findById(req.params.id);
    if(!request){
        throw new ApiError(404,"Request not found");
    }
    if(request.status!=="Pending"){
        throw new ApiError( 400, "Request is not pending.");
    }
    if(request.currentApprover.toString() !==req.user._id){
        throw new ApiError(403, "You are not the current approver.");
    }
    const workflow = await findWorkflow(request.workflow);
    const team = await Team.findById(request.team);

    request.approvalHistory.push({
        step: request.currentStep,
        approver: req.user._id,
        role: req.user.role,
        action: "Approved",
        comments: req.body.comments
    });
    const next =
        resolveNextApprover(
            team,
            workflow,
            request.currentStep
        );
    if(!next){
        request.status="Approved";
        request.completedAt=new Date();
        request.currentApprover=null;
    }
    else{
        request.currentStep=next.currentStep;
        request.currentApprover= next.currentApprover;
    }
    await request.save();
    return request;
}

exports.rejectRequest = async(req)=>{
    const request = await Request.findById(req.params.id);
    if(!request){
        throw new ApiError(404, "Request not found.");
    }
    if( request.currentApprover.toString() !== req.user._id){
        throw new ApiError(403, "Access denied.");
    }

    request.approvalHistory.push({
        step: request.currentStep,
        approver: req.user._id,
        role: req.user.role,
        action: "Rejected",
        comments: req.body.comments
    });
    request.status="Rejected";
    request.completedAt=new Date();
    request.currentApprover=null;
    await request.save();
    return request;
}