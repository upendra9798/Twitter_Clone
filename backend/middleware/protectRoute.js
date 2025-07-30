import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        // ✅ Correct way: req.cookies not req.cookie
        const token = req.cookies?.jwt;

        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        // ✅ Correct usage: findById, not findOne, and pass ID directly
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (err) {
        console.log("Error in protectRoute middleware:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


/*What does it do?
Checks the JWT token stored in cookies (req.cookies.jwt).

Verifies the token using your secret key.

Finds the user in the database using the userId from the token.

If everything is valid, it attaches req.user to the request and calls next() → now getMe can use req.user.

If invalid or missing token, it returns 401 Unauthorized.
*/