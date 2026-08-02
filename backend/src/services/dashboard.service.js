const User = require("../models/userSchema");
const Team = require("../models/teamSchema");
const Workflow = require("../models/workflowSchema");
const ApiError = require("../utils/ApiError");
const { ROLES } = require("../constants/roles");
const Request = require("../models/requestSchema");

const getDashboard = async (req) => {
    switch (req.user.role) {
        case ROLES.EMPLOYEE:
            return await getEmployeeDashboard(req.user._id);
        case ROLES.MANAGER:
            return await getManagerDashboard(req.user._id);
        case ROLES.ADMIN:
            return await getAdminDashboard();
        default:
            throw new ApiError(403, "Invalid role.");
    }
};

const getEmployeeDashboard = async (userId) => {
    const [drafts, pending, approved, rejected, cancelled, recentRequests] =
        await Promise.all([
        Request.countDocuments({
            createdBy: userId,
            status: "Draft",
        }),

        Request.countDocuments({
            createdBy: userId,
            status: "Pending",
        }),

        Request.countDocuments({
            createdBy: userId,
            status: "Approved",
        }),

        Request.countDocuments({
            createdBy: userId,
            status: "Rejected",
        }),

        Request.countDocuments({
            createdBy: userId,
            status: "Cancelled",
        }),

        Request.find({
            createdBy: userId,
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("workflow", "name")
            .populate("currentApprover", "firstName lastName"),
        ]);

    return {
        summary: {
        drafts,
        pending,
        approved,
        rejected,
        cancelled,
        },
        recentRequests,
        pendingApprovals: null,
        system: null
    };
};

const getManagerDashboard = async (userId) => {
        const [
            drafts,
            pending,
            approved,
            rejected,
            cancelled,
            pendingApprovals,
            myRecentRequests,
            approvalQueue

    ] = await Promise.all([
            Request.countDocuments({
                createdBy: userId,
                status: "Draft"

        }),
            Request.countDocuments({
                createdBy: userId,
                status: "Pending"

        }),
            Request.countDocuments({
                createdBy: userId,
                status: "Approved"

        }),
            Request.countDocuments({
                createdBy: userId,
                status: "Rejected"

        }),
            Request.countDocuments({
                createdBy: userId,
                status: "Cancelled"

        }),
            Request.countDocuments({
                currentApprover: userId,
                status: "Pending"

        }),
            Request.find({
                createdBy: userId

        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("workflow", "name"),
            Request.find({
                currentApprover: userId,
                status: "Pending"

        })
            .sort({ submittedAt: -1 })
            .limit(5)
            .populate("createdBy", "firstName lastName")
            .populate("workflow", "name")
            .populate("team", "name")

    ]);
    return {
        summary: {
            drafts,
            pending,
            approved,
            rejected,
            cancelled
        },
        recentRequests: myRecentRequests,
        pendingApprovals: {
            count: pendingApprovals,
            requests: approvalQueue
        },
        system: null
    };
};

const getAdminDashboard = async () => {
        const [
            users,
            teams,
            workflows,
            pending,
            approved,
            rejected,
            recentRequests

    ] = await Promise.all([
            User.countDocuments({
                isActive: true

        }),
            Team.countDocuments({
                isActive: true

        }),
            Workflow.countDocuments({
                isActive: true

        }),
            Request.countDocuments({
                status: "Pending"

        }),
            Request.countDocuments({
                status: "Approved"

        }),
            Request.countDocuments({
                status: "Rejected"

        }),
            Request.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("createdBy", "firstName lastName")
            .populate("workflow", "name")
            .populate("team", "name")

    ]);
    return {
        summary: {
            pending,
            approved,
            rejected
        },

        recentRequests,

        pendingApprovals: null,

        system: {
            users,
            teams,
            workflows
        }
    };
};

module.exports = {getDashboard}