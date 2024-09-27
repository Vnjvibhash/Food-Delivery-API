import { authRoutes } from './auth.js';
import { orderRoutes } from './order.js';
import { categoryRoutes, productRoutes } from './product.js';
const prefix = '/api/v1';

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes, { prefix });
    fastify.register(categoryRoutes, { prefix });
    fastify.register(productRoutes, { prefix });
    fastify.register(orderRoutes, { prefix });
};
