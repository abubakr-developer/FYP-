import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized: No token provided. Please log in again." 
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (tokenDecode.id) {
            // attach id and role (if present) for downstream middlewares
            req.user = { _id: tokenDecode.id, role: tokenDecode.role };
            next(); // Proceed to the next middleware/route
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: Invalid token format." 
            });
        }
    } catch (error) {
        console.log("JWT Error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: Token expired (1 minute limit). Please log in again." 
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized: Invalid token. Please log in again." 
            });
        }

        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized: Token verification failed.",
            error: error.message 
        });
    }
};

export default userAuth;