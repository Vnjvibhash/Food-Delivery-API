import { Customer, DeliveryPartner } from "../../models/users.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    );
    const refreshToken = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return { accessToken, refreshToken };
};


export const loginCustomer = async (req, res) => {
    try {
        const { phone } = req.body;
        let customer = await Customer.findOne({ phone });

        if (!customer) {
            customer = await Customer.create({
                phone,
                role: "Customer",
                isActivated: true
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateToken(customer);

        return res.send({
            message: customer ? "Logged in successfully." : "Registered successfully.",
            accessToken,
            refreshToken,
            customer
        });

    } catch (error) {
        return res.status(500).send({ message: "An Error Occured", error });
    }
};


export const loginDeliveryPartner = async (req, res) => {
    try {
        const { email, password } = req.body;

        const deliveryPartner = await DeliveryPartner.findOne({ email });
        if (!deliveryPartner) {
            return res.status(404).send({ message: "Delivery Partner not found" });
        }

        const isMatch = await bcrypt.compare(password, deliveryPartner.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid Password" });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateToken(deliveryPartner);

        return res.send({
            message: "Logged in successfully.",
            accessToken,
            refreshToken,
            deliveryPartner
        });

    } catch (error) {
        return res.status(500).send({ message: "An Error Occured", error });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(403).send({ message: "Access Denied" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let user;

        if (decoded.role === "Customer") {
            user = await Customer.findById(decoded.userId);
        } else if (decoded.role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(decoded.userId);
        } else {
            return res.status(401).send({ message: "Invalid User Role" });
        }

        if (!user || !user.isActivated) {
            return res.status(404).send({ message: "Invalid User or Token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

        return res.send({
            message: "Refreshed successfully",
            accessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        return res.status(500).send({ message: "An Error Occured", error });
    }
};


export const fetchUser = async (req, reply) => {
    try {
        const { userId, role } = req.user;

        let user;
        if (role === "Customer") {
            user = await Customer.findById(userId);
        } else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(userId);
        } else {
            return reply.status(401).send({ message: "Invalid User Role" });
        }

        if (!user) {
            return reply.status(404).send({ message: "Invalid User" });
        }

        return reply.send({
            message: "User data fetched successfully",
            user
        });
    } catch (error) {
        return reply.status(500).send({ message: "An Error Occurred", error });
    }
};


