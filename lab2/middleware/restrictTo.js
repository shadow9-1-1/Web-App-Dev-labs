// Middleware for Role-Based Access Control (RBAC)
// Allow access only to specified roles

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array e.g. ['admin', 'user']
        // req.user comes from protect middleware
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }
        
        next();
    };
};

module.exports = restrictTo;
