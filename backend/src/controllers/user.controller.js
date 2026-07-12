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
        console.log(req.user)
        const search = req.query.search;
        const role = req.query.role;
        const department = req.query.department;
        const status = req.query.status;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page-1)*limit;

        const query = {};
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" }},
                {lastName: {$regex: search,$options: "i"}},
                {email: {$regex: search,$options: "i"}}
            ];
        }

        if(role){
            query.role = role
        }

        if(status !== undefined){
            query.isActive = status==='true'
        }

        if(department){
            query.department = department
        }

        if (req.user.role === "manager") {
            query.managerId = req.user._id;
        }
        const user = await User.find(query).select("-password").skip(skip).limit(limit);

        const totalRecords = await User.countDocuments(query);
        const totalPages = Math.ceil(totalRecords/limit);
        res.status(200).json({
            success: true,
            data: user,
            pagination: {
                totalRecords,
                currentPage: page,
                totalPages,
                pageSize: limit
            }
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
        const user = await User.findById(id).select("-password");
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
        const data = req.body
        const id = req.params.id
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await User.findByIdAndUpdate(id, data, {new: true})
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
        const id = req.params.id
        const status = req.params.status === "true"
        const user = await User.findById(id)
        user.isActive = status
        await user.save();
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
        const id = req.params.id
        const user = await User.findByIdAndDelete(id)
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