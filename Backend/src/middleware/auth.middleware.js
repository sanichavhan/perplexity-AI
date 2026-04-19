import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklistToken.model.js";


export async function authUser(req, res, next) {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        })
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });

    if (isBlacklisted) {
        res.clearCookie("token");
        return res.status(401).json({
            message: "Unauthorized - Token blacklisted",
            success: false
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        })
    }

}

