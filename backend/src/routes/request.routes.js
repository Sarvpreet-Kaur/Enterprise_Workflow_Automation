const express = require("express")
const requestRouter = express.Router();
const {ROLES} = require('../constants/roles')

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

const {createRequest, updateRequest, getRequestById, getRequests, submitRequest, cancelRequest, getPendingRequests, approveRequest, rejectRequest} = require("../controllers/request.controller");
// Manager & Employee
requestRouter.post("/", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), createRequest);
requestRouter.put("/:id", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), updateRequest);
requestRouter.patch("/:id/submit", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), submitRequest);
requestRouter.patch("/:id/:cancel", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), cancelRequest);
// requestRouter.delete("/:id", authMiddleware, roleMiddleware(ROLES.MANAGER, ROLES.EMPLOYEE), deleteRequest);

//All 
requestRouter.get("/", authMiddleware, getRequests);
requestRouter.get("/:id", authMiddleware, getRequestById);
requestRouter.get("/pending/:id", authMiddleware, getPendingRequests)
requestRouter.put("/approve/:id", authMiddleware, approveRequest)
requestRouter.put("/reject/:id", authMiddleware, rejectRequest)
module.exports = requestRouter;