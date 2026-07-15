const express = require("express")
const workflowRouter = express.Router();

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../constants/roles");
const  {createWorkflow, getWorkflows, getWorkflowById, updateWorkflow, deleteWorkflow} = require('../controllers/workflow.controller')
workflowRouter.use(authMiddleware);

workflowRouter.post("/", roleMiddleware(ROLES.ADMIN), createWorkflow);
workflowRouter.get("/", getWorkflows);
workflowRouter.get("/:id", roleMiddleware(ROLES.ADMIN), getWorkflowById);
workflowRouter.put("/:id", roleMiddleware(ROLES.ADMIN), updateWorkflow);
workflowRouter.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteWorkflow);

module.exports = workflowRouter;