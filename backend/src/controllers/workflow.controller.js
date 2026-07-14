const workflowService = require("../services/workflow.service");

const createWorkflow = async (req, res, next) => {
    try {
        const workflow = await workflowService.createWorkflow(req.body);
        res.status(201).json({
            success: true,
            message: "Workflow created successfully.",
            data: workflow
        });
    } catch (error) {
        next(error);
    }
};

const getAllWorkflows = async (req, res, next) => {
    try {
        const workflows = await workflowService.getAllWorkflows();
        return res.status(200).json({
            success: true,
            count: workflows.length,
            data: workflows
        });
    } catch (error) {
        next(error);
    }
};

const getWorkflowById = async(req, res, next)=>{
    try {
        const workflows = await workflowService.getWorkflowById(req.params.id);
        return res.status(200).json({
            success: true,
            data: workflows
        });
    } catch (error) {
        next(error);
    }
}

const updateWorkflow = async(req, res, next)=>{
    try{
        const workflows = await workflowService.updateWorkflow(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            data: workflows
        })
    }
    catch(error){
        next(error);
    }
}

const deleteWorkflow = async(req, res, next)=>{
    try{
        const workflows = await workflowService.deleteWorkflow(req.params.id);
        return res.status(200).json({
            success: true,
            data: workflows
        })
    }
    catch(error){
        next(error);
    }
}

module.exports = {createWorkflow, getAllWorkflows, getWorkflowById}