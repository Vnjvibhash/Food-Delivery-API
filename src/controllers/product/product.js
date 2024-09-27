import { Product } from "../../models/product.js";

export const getProductByCategory = async (req, res) => {
    const { categoryID } = req.params;
    try {
        const products = await Product.find({ category: categoryID })
        .select("-category");
        console.log(products);
        if (!products) {
            return res.status(404).send({ message: "Products not found." });
        }
        res.status(200).send({ message: "Products retrieved successfully.", products });
    } catch (error) {
        res.status(500).send({ message: "An Error Occurred", error });
    }
}