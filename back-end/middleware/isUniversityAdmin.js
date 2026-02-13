export const isUniversityAdmin = (req, res, next) => {
    console.log('Checking admin - user:', req.user);

    if (!req.user?.role || req.user.role !== 'university') {
        return res.status(403).json({
            success: false,
            message: "Access denied: University admin required"
        });
    }

    next();
};