const express = require("express")
const workflowRouter = express.Router();

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../constants/roles");

workflowRouter.use(authMiddleware);

workflowRouter.post("/", roleMiddleware(ROLES.ADMIN), createTeam);
workflowRouter.get("/", getTeams);
workflowRouter.get("/:id", roleMiddleware(ROLES.ADMIN), getTeamById);
workflowRouter.put("/:id", roleMiddleware(ROLES.ADMIN), updateTeam);
workflowRouter.delete("/:id", roleMiddleware(ROLES.ADMIN), deleteTeam);

module.exports = workflowRouter;