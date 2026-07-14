const { ROLES } = require("../constants/roles");
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const Team = require("../models/teamSchema");
const ApiError = require("../utils/apiError")

exports.createUser = async (req) => {
    const data = req.body;
    // Email validation
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        throw new ApiError(409, "Email already exists");
    }
    // Employee validation
    if (data.role === "employee") {
        if (!data.team) {
            throw new ApiError(400, "Employee must belong to a team.");
        }
        const team = await Team.findById(data.team);
        if (!team || !team.isActive) {
            throw new ApiError(404, "Team not found");
        }
        // Store as array
        data.teams = [team._id];
        // Remove temporary field if frontend sends `team`
        delete data.team;
    }

    // Manager/Admin validation
    if (
        (data.role === "manager" || data.role === "admin") &&
        data.team
    ) {
        throw new ApiError(400, "Managers and Admins are assigned through the Team module.");
    }

    // Password hashing
    data.password = await bcrypt.hash(data.password, 10);

    const user = await User.create(data);

    return user;
};

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

    const user = await User.find(query).select("-password").skip(skip).limit(limit).populate("teams","name department");

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
    const user = await User.findById(id).select("-password").populate("teams","name department");
    if (!user || !user.isActive) {
    throw new ApiError(404, "User not found");
}
    return user
}

exports.updateUser = async (id, req) => {
    const data = req.body;
    const user = await User.findById(id);
    if (!user || !user.isActive) {
        throw new ApiError(409, "User not found");
    }
    // Email validation
    if (data.email && data.email !== user.email) {
        const existing = await User.findOne({ email: data.email });
        if (existing) {
            throw new ApiError(409, "Email already exists");
        }
    }
    // Employee Team Update
    if (user.role === "employee" && data.teams) {
        if (data.teams.length !== 1) {
            throw new ApiError(400, "Employee must belong to exactly one team.");
        }
        const team = await Team.findById(data.teams[0]);
        if (!team || !team.isActive) {
            throw new ApiError(404, "Invalid Team");
        }
        user.teams = data.teams;
    }
    // Prevent Manager/Admin team update
    if (
        (user.role === "manager" || user.role === "admin") &&
        data.teams
    ) {
        throw new ApiError(404, "Managers and Admins must be assigned through Team APIs.");
    }

    if (data.role && data.role !== user.role) {
        throw new ApiError(
            400,
            "User role cannot be updated."
        );
    }
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // Update remaining fields
    user.firstName = data.firstName ?? user.firstName;
    user.lastName = data.lastName ?? user.lastName;
    user.email = data.email ?? user.email;
    if (data.password) {
        user.password = await bcrypt.hash(data.password, 10);
    }
    await user.save();
    return user;
};

exports.changeUserStatus = async(req)=>{
    const id = req.params.id
    const status = req.params.status === "true"
    const user = await User.findById(id)
    user.isActive = status
    await user.save();
    return user
}

exports.deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user || !user.isActive) {
        throw new ApiError(404, "User not found");
    }
    // Manager Validation
    if (user.role === ROLES.MANAGER) {
        const team = await Team.findOne({
            manager: user._id,
            isActive: true
        });
        if (team) {
            throw new ApiError(409, "Manager is assigned to an active team." );
        }
    }

    // Admin Validation
    if (user.role === ROLES.ADMIN) {
        const team = await Team.findOne({
            admin: user._id,
            isActive: true
        });

        if (team) {
            throw new ApiError(
                400,
                "Admin is assigned to an active team."
            );
        }
    }

    user.isActive = false;

    await user.save();

    return user;
};