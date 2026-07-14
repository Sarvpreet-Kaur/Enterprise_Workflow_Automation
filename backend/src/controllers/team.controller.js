const teamService = require('../services/team.service')

const createTeam = async(req, res, next)=>{
    try{
        const Team = await teamService.createTeam(req)
        res.status(201).json({
            success: true,
            data: Team
        });
    }
    catch(err){
        next(error)
    }
}

const getTeams = async(req, res, next)=>{
    try{
        const Teams = await teamService.getTeams(req)
        res.status(201).json({
            success: true,
            data: Teams
        })
    }
    catch(err){
        next(error)
    }
}

const getTeamById = async(req, res, next)=>{
    try{
        const Teams = await teamService.getTeamById(req.params.id)
        res.status(201).json({
            success: true,
            data: Teams
        })
    }
    catch(err){
        next(error)
    }
}

const updateTeam = async(req, res, next)=>{
    try{
        const Teams = await teamService.updateTeam(req.params.id, req.body)
        res.status(201).json({
            success: true,
            data: Teams
        })
    }
    catch(err){
        next(error)
    }
}

const deleteTeam = async(req, res, next)=>{
    try{
        const Teams = await teamService.deleteTeam(req.params.id)
        res.status(201).json({
            success: true,
            data: Teams
        })
    }
    catch(err){
        next(error)
    }
}
module.expors = {createTeam, getTeams, getTeamById, updateTeam, deleteTeam}