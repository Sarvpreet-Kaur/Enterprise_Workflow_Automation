const express = require("express")
const userRouter = express.Router();

const {createUser, getUsers, getUserById, updateUser, changeUserStatus, deleteUser} = require("../controllers/user.controller")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

// Admin
userRouter.post("/", authMiddleware, roleMiddleware("admin"), createUser);
userRouter.put("/:id", authMiddleware, roleMiddleware("admin"), updateUser);
userRouter.patch("/:id/:status", authMiddleware, roleMiddleware("admin"), changeUserStatus);
userRouter.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

// Admin & Manager
userRouter.get("/", authMiddleware, roleMiddleware("admin", "manager"), getUsers);
userRouter.get("/:id", authMiddleware, roleMiddleware("admin", "manager"), getUserById);

module.exports = userRouter;