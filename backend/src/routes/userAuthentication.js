const express = require('express');
const {register, login, logout, adminRegister, setupAdmin, deleteProfile, check, getProfile} = require('../controllers/userAuthenticationMethod')
const authRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.post('/setupAdmin', setupAdmin)
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile)
authRouter.get('/check', userMiddleware, check)
authRouter.get('/getProfile', userMiddleware, getProfile)

module.exports = authRouter
