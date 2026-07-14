const express = require("express")
const teamRouter = express.Router();

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../constants/roles");
const {createTeam, getTeams, getTeamById, updateTeam, deleteTeam} = require('../controllers/team.controller')

teamRouter.use(authMiddleware);
teamRouter.use(roleMiddleware(ROLES.ADMIN));

teamRouter.post("/", createTeam);
teamRouter.get("/", getTeams);
teamRouter.get("/:id", getTeamById);
teamRouter.put("/:id", updateTeam);
teamRouter.delete("/:id", deleteTeam);

module.exports = teamRouter;