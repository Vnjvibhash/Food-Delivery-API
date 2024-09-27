import { fetchUser, loginCustomer, loginDeliveryPartner, refreshToken } from "../controllers/auth/auth.js";
import { updateUser } from "../controllers/tracking/user.js";
import { verifyToken } from "../middleware/auth.js";

export const authRoutes = async (fastify) => {
    fastify.post('/customer/login', loginCustomer);
    fastify.post('/delivery-partner/login', loginDeliveryPartner);
    fastify.post('/refresh', refreshToken);

    // Protected route: only accessible with token verification
    fastify.get('/user', { preHandler: [verifyToken] }, fetchUser);
    fastify.patch('/update-user', { preHandler: [verifyToken] }, updateUser); // PATCH I've used to Partialli Update the data. You can use PUT to update the whole data
};
