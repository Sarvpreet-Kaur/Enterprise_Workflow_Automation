const { ROLES } = require('../constants/roles');
const Team = require('../models/teamSchema');
const User = require('../models/userSchema');
const ApiError = require('../utils/ApiError')

exports.createTeam = async(req, res)=>{
    const data = req.body
    const existingTeam = await Team.findOne({name: data.name});
    if(existingTeam){
        throw new ApiError(409, "Name already exists")
    }

    const manager = await User.findById(data.manager)
    if(!manager || manager.role !== ROLES.MANAGER || !manager.isActive){
        throw new ApiError(404, "Manager not found")
    }

    const admin = await User.findById(data.admin)
    if(!admin || admin.role !== ROLES.ADMIN || !admin.isActive){
        throw new ApiError(404, "Admin not found")
    }

    const team = await Team.create({
        name: data.name,
        department: data.department,
        manager: manager._id,
        admin: admin._id
    });

    await User.findByIdAndUpdate(manager._id, {$addToSet: {teams: team._id}});
    await User.findByIdAndUpdate(admin._id, {$addToSet: {teams: team._id}})
    return team
}

exports.getTeams = async (req) => {
    const search = req.query.search
    const manager = req.query.manager
    const admin = req.query.admin
    const department = req.query.department
    const status = req.query.status;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit

    const query = {}

    if(search){
        query.$or = [
            { name: { $regex: search, $options: "i" }}
        ];
    }
    
    if(manager && manager!==''){
        query.manager = manager
    }

    if(status !== undefined && status!==''){
        query.isActive = status==='true'
    }

    if(department && department!==''){
        query.department = department
    }

    if(admin && admin!==''){
        query.admin = admin
    }
    const teams = await Team.find({...query})
        .skip(skip).limit(limit)
        .populate(ROLES.MANAGER, "firstName lastName email role")
        .populate(ROLES.ADMIN, "firstName lastName email role")
        .sort({ createdAt: -1 });

    const totalRecords = await Team.countDocuments(query);
    const totalPages = Math.ceil(totalRecords/limit)

    return ({
        data: teams,
        pagination: {
            totalRecords,
            currentPage: page,
            pageSize: limit,
            totalPages
        }
    });
};

exports.getTeamById = async (id) => {
    const team = await Team.findById(id)
        .populate(ROLES.MANAGER, "firstName lastName email role")
        .populate(ROLES.ADMIN, "firstName lastName email role");

    if (!team || !team.isActive) {
        throw new ApiError(404, "Team not found.");
    }
    return team;
};

exports.updateTeam = async (id, data) => {
    const team = await Team.findById(id);
    if (!team || !team.isActive) {
        throw new ApiError(404, "Team not found.");
    }
    if (data.name) {
        const existing = await Team.findOne({
            name: data.name,
            _id: { $ne: id }
        });
        if (existing) {
            throw new ApiError(409, "Team name already exists.");
        }
        team.name = data.name;
    }
    if (data.department) {
        team.department = data.department;
    }
    if (data.manager) {
        const manager = await User.findById(data.manager);
        if (!manager)
            throw new ApiError(404, "Manager not found.");
        if (manager.role !== ROLES.MANAGER)
            throw new ApiError(400, "Invalid manager.");
        if (!manager.isActive)
            throw new ApiError(400, "Manager is inactive.");
        team.manager = data.manager;
    }
    if (data.admin) {
        const admin = await User.findById(data.admin);
        if (!admin)
            throw new ApiError(404, "Admin not found.");
        if (admin.role !== ROLES.ADMIN)
            throw new ApiError(400, "Invalid admin.");
        if (!admin.isActive)
            throw new ApiError(400, "Admin is inactive.");
        team.admin = data.admin;
    }
    if (team.manager.equals(team.admin)) {
        throw new ApiError(400, "Manager and Admin cannot be same.");
    }
    await team.save();
    await team.populate([
        { path: ROLES.MANAGER, select: "firstName lastName email role" },
        { path: ROLES.ADMIN, select: "firstName lastName email role"}
    ]);
    return team;
};

exports.deleteTeam = async (id) => {
    const team = await Team.findById(id);
    if (!team || !team.isActive) {
        throw new ApiError(404, "Team not found.");
    }
    team.isActive = false;

    await User.findByIdAndUpdate(team.manager, {$pull: {teams: team._id}})
    await User.findByIdAndUpdate(team.admin, {$pull: {teams: team._id}})
    await team.save();
};