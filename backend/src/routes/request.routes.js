const express = require("express")
const requestRouter = express.Router();
const {ROLES} = require('../constants/roles')

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {createRequest} = require("../controllers/request.controller")
// Manager & Employee
requestRouter.post("/", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), createRequest);
// requestRouter.put("/:id", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), updateRequest);
// requestRouter.patch("/:id/:cancel", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), changeRequestStatus);
// requestRouter.delete("/:id", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), deleteRequest);

// //All 
// requestRouter.get("/", authMiddleware, getUsers);
// requestRouter.get("/:id", authMiddleware, getUserById);

module.exports = requestRouter;