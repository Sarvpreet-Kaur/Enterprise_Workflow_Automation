const { ROLES } = require("../constants/roles");
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")

exports.createUser = async(req)=>{
    const data = req.body
    const existingUser = await User.findOne({email: data.email});
    if(existingUser){
        throw new Error("Email already exists")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword

    const user = await User.create(data)
    return user
}

exports.getUsers = async(req)=>{
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

    if (req.user.role === ROLES.MANAGER) {
        query.managerId = req.user._id;
    }
    const user = await User.find(query).select("-password").skip(skip).limit(limit);

    const totalRecords = await User.countDocuments(query);
    const totalPages = Math.ceil(totalRecords/limit);
    return ({
        data: user,
        pagination: {
            totalRecords,
            currentPage: page,
            totalPages,
            pageSize: limit
        }
    });
}

exports.getUserById = async(req)=>{
    const id = req.params.id
    const user = await User.findById(id).select("-password");
    return user
}

exports.updateUser = async(req)=>{
    const data = req.body
    const id = req.params.id
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, data, {new: true})
    return user
}

exports.changeUserStatus = async(req)=>{
    const id = req.params.id
    const status = req.params.status === "true"
    const user = await User.findById(id)
    user.isActive = status
    await user.save();
    return user
}

exports.deleteUser = async(req)=>{
    const id = req.params.id
    const user = await User.findByIdAndDelete(id)
    return user
}