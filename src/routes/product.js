import { getCategory } from "../controllers/product/category.js";
import { getProductByCategory } from "../controllers/product/product.js";

export const categoryRoutes = async (fastify) => {
    fastify.get("/categories", getCategory);
}
export const productRoutes = async (fastify) => {
    fastify.get("/products/:categoryID", getProductByCategory);
}