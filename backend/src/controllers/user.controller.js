const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const userService = require("../services/user.service")

const createUser = async(req, res)=>{
    try{
        const user = await userService.createUser(req)
        res.status(201).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message+"creation"
        })
    }
}

const getUsers = async(req, res)=>{
    try{
        const result = (await userService.getUsers(req))
        const user = result.data
        const pagination = result.pagination

        res.status(200).json({
            success: true,
            data: user,
            pagination: pagination,
            summary: result.summary
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const getUserById = async(req, res)=>{
    try{
        const user = await userService.getUserById(req)
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const updateUser = async(req, res)=>{
    try{
        const user = await userService.updateUser(req.params.id, req)
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const changeUserStatus = async(req, res)=>{
    try{
        const user = await userService.changeUserStatus(req)
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const deleteUser = async(req, res)=>{
    try{
        const user = await userService.deleteUser(req.params.id)
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {createUser, getUsers, getUserById, updateUser, changeUserStatus, deleteUser}