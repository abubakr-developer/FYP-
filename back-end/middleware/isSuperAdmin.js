export const isSuperAdmin = (req, res, next) => {
    
    if (!req.user || req.user.role !== 'superAdmin') {
        return res.status(403).json({ 
            success: false, 
            message: "Access denied: Only super admins are allowed to access this resource." 
        });
    }
    next();
}