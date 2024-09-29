import "dotenv/config";
import bcrypt from "bcryptjs";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
});

sessionStore.on("error", (error) => {
    console.log("ession Store Error", error);
})

export const authenticate = async (email, password) => {
    if (email && password) {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return null;
        }
        const isMatch = bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return null;
        }
        return Promise.resolve({email: admin.email, password: admin.password, role: admin.role, isActivated: admin.isActivated});
    }
    return null;
}

export const HOST = process.env.HOST || "localhost";
export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;