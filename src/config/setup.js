import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import { dark, light, noSidebar } from "@adminjs/themes";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                listProperties: ["name", "phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ["name", "email", "phone", "role", "isActivated", "branch"],
                filterProperties: ["email", "branch"],
            },
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ["name", "email", "phone", "role", "isActivated"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Models.Branch,
        },
        {
            resource: Models.Counter,
        },
        {
            resource: Models.Category,
            options: {
                listProperties: ["name", "image"],
            },
        },
        {
            resource: Models.Product,
            options: {
                listProperties: ["name", "quantity", "price", "mrpPrice", "category", "image"],
                filterProperties: ["quantity", "price", "category"],
            },
        },
        {
            resource: Models.Order,
            options: {
                listProperties: ["orderId", "customerId", "deliveryPartnerId", "branchId", "orderStatus", "totalAmount", "paymentMode", "paymentStatus"],
                filterProperties: ["branchId", "orderStatus", "paymentMode", "paymentStatus"],
            },
        },
    ],
    branding: {
        companyName: "Innovateria",
        withMadeWithLove: false,
        logo: "https://res.cloudinary.com/dygjekix5/image/upload/f_auto,q_auto/logo",
        defaultTheme: dark.id,
        availableThemes: [dark, light, noSidebar],
    },
    rootPath: "/admin",
})


export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword: COOKIE_PASSWORD,
            cookieName: "Innovateria",
        },
        app,
        {
            store: sessionStore,
            saveUninitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            }
        }
    )
}
