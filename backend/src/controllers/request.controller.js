const requestService = require('../services/request.service')

const createRequest = async(req, res, next)=>{
    try {
        const request = await requestService.createRequest(req);
        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
}