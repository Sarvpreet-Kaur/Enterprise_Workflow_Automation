const express = require("express")
const userRouter = express.Router();

const {createUser, getUsers, getUserById, updateUser, changeUserStatus, deleteUser} = require("../controllers/user.controller")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware");
const { ROLES } = require("../constants/roles");

// Admin
userRouter.post("/", authMiddleware, roleMiddleware(ROLES.ADMIN), createUser);
userRouter.put("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), updateUser);
userRouter.patch("/:id/:status", authMiddleware, roleMiddleware(ROLES.ADMIN), changeUserStatus);
userRouter.delete("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN), deleteUser);

// Admin & Manager
userRouter.get("/", authMiddleware, roleMiddleware(ROLES.ADMIN, ROLES.MANAGER), getUsers);
userRouter.get("/:id", authMiddleware, roleMiddleware(ROLES.ADMIN, ROLES.MANAGER), getUserById);

module.exports = userRouter;