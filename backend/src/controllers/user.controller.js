const User = require("../models/userSchema")
const bcrypt = require("bcrypt")

const createUser = async(req, res)=>{
    try{
        const data = req.body
        const existingUser = await User.findOne({email: data.email});
        if(existingUser){
            throw new Error("Email already exists")
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword

        const user = await User.create(data)
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
        const user = await User.find();
        res.status(201).json({
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

const getUserById = async(req, res)=>{
    try{
        const id = req.params.id
        const user = await User.findById(id)
        res.status(201).json({
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
        const data = req.body
        const id = req.params.id
        const user = await User.findByIdAndUpdate(id, data, {new: true})
        res.status(201).json({
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
        const id = req.params.id
        const status = req.params.status
        const user = await User.findById(id)
        user.isActive = status
        await user.save();
        res.status(201).json({
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
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
        res.status(201).json({
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