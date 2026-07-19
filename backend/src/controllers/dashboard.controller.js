const dashboardService = require('../services/dashboard.service')

exports.getDashboard = async (req, res, next) => {
    try {
        const data = await dashboardService.getDashboard(req);
        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};