const User = require('../models/userSchema')
const Team = require('../models/teamSchema')
const Worlflow = require('../models/workflowSchema')

findLoggedInUser() = async(id)=>{
    const user = await User.findById(id);
    if (!user || !user.isActive) {
        throw new ApiError(409, "User not found");
    }
    return user
}

findWorkflow() = async(id)=>{
    const workflow = await Workflow.findById(id);
    if (!workflow || !workflow.isActive) {
        throw new ApiError(409, "Workflow not found");
    }
    return workflow
}

exports.createRequest = async(req, res)=>{
    console.log(req)
    const user = await findLoggedInUser(req.user.id)
    const workflow = await findWorkflow(req.body.workflow)
    const team 
}