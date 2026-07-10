const userService = require("../services/user.service")

const createUser = async(req, res)=>{
    try{
        const user = await userService.createUser(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUsers = async(req, res)=>{
    try{
        const user = await userService.getUsers(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserById = async(req, res)=>{
    try{
        const user = await userService.getUserById(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateUser = async(req, res)=>{
    try{
        const user = await userService.updateUser(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const changeUserStatus = async(req, res)=>{
    try{
        const user = await userService.changeUserStatus(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteUser = async(req, res)=>{
    try{
        const user = await userService.deleteUser(req.body)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}