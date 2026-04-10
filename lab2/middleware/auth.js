const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No authorization provided.'
        });
    }
    

    const token = authHeader.split(' ')[1]; 
    
    if (!token || token !== 'secret-token') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Invalid token.'
        });
    }
    
    next();
};

module.exports = authMiddleware;
