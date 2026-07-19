const express = require("express")
const dashboardRouter = express.Router();
const {ROLES} = require('../constants/roles')

const authMiddleware = require("../middleware/authMiddleware")
const {getDashboard} = require('../controllers/dashboard.controller')

dashboardRouter.get( "/", authMiddleware, getDashboard);

module.exports = dashboardRouter