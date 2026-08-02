const requestService = require('../services/request.service')

const createRequest = async(req, res, next)=>{
    try {
        const request = await requestService.createRequest(req);
        res.status(201).json({
            success: true,
            message: "Draft created successfully.",
            data: request
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

const getRequests = async (req, res, next) => {
    try {
        const result = await requestService.getRequests(req);
        const request = result.data
        const pagination = result.pagination
        res.status(200).json({
            success: true,
            data: request,
            pagination: pagination,
        });
    } catch (error) {
        next(error);
    }
};

const getRequestById = async (req, res, next) => {
    try {
        const request = await requestService.getRequestById(req);
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
};

const cancelRequest = async (req, res, next) => {
    try {
        const request = await requestService.cancelRequest(req);
        res.status(200).json({
            success: true,
            message: "Request cancelled successfully.",
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

const getPendingRequests = async (req, res, next) => {
    try {
        const request = await requestService.getPendingRequests(req);
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
};

const approveRequest = async (req, res, next) => {
    try {
        const request = await requestService.approveRequest(req);
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
};

const rejectRequest = async (req, res, next) => {
    try {
        const request = await requestService.rejectRequest(req);
        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {createRequest, updateRequest, getRequestById, getRequests, submitRequest, cancelRequest, getPendingRequests, approveRequest, rejectRequest}