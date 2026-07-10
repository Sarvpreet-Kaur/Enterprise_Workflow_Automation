const express = require("express")
const userRouter = express.Router();

const userController = require("../controllers/user.controller")
const {authMiddleware} = require("../middleware/authMiddleware")
const {roleMiddleware} = require("../middleware/roleMiddleware")

// Admin
userRouter.post("/", authMiddleware, roleMiddleware("admin"), userController.createUser);
userRouter.put("/:id", authMiddleware, roleMiddleware("admin"), userController.updateUser);
userRouter.patch("/:id/status", authMiddleware, roleMiddleware("admin"), userController.changeUserStatus);
userRouter.delete("/:id", authMiddleware, roleMiddleware("admin"), userController.deleteUser);

// Admin & Manager
userRouter.get("/", authMiddleware, roleMiddleware("admin", "manager"), userController.getUsers);
userRouter.get("/:id", authMiddleware, roleMiddleware("admin", "manager"), userController.getUserById);

module.exports = userRouter;