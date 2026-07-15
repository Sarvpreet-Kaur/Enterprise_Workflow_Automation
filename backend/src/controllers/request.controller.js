const requestService = require('../services/request.service')

const createRequest = async(req, res, next)=>{
    try {
        const request = await requestService.createRequest(req);
        res.status(201).json({
            success: true,
            message: "Draft created successfully.",
            data: draft
        });
    } catch (error) {
        next(error);
    }
}

const updateRequest = async (req, res, next) => {
    try {
        const request = await requestService.updateRequest(req);
        res.status(200).json({
            success: true,
            message: "Request updated successfully.",
            data: request
        });
    } catch (error) {
        next(error);
    }
};

const submitRequest = async (req, res, next) => {
    try {
        const request = await requestService.submitRequest(req);
        res.status(200).json({
            success: true,
            message: "Request submitted successfully.",
            data: request
        });
    } catch (error) {
        next(error);
    }
};