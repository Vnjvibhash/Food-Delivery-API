import { confirmOrder, createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = async (fastify) => {
    fastify.addHook("preHandler", async (req, res) => {
        const isActivated = await verifyToken(req, res);
        if (!isActivated) {
            return res.status(401).send({ message: "Unauthorized" });
        }
    });

    fastify.post('/order',createOrder);
    fastify.get('/orders',getOrders);
    fastify.get('/order/:orderId',getOrderById);
    fastify.patch('/order/:orderId/status', updateOrderStatus);
    fastify.post('/order/:orderId/confirm', confirmOrder);
};