export const isUniversityAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'universityAdmin') {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied: University admins are not allowed to access this resource." 
        });
    }
    next();
};