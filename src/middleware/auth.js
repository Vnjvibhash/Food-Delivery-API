import jwt from "jsonwebtoken";
import 'dotenv/config';

export const verifyToken = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).send({ message: "Access Denied. No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        return true;
    } catch (error) {
        return res.status(401).send({ message: "Invalid or Expired Token" });
    }
};
