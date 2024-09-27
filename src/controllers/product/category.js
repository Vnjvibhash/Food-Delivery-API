import { Category } from "../../models/category.js";

export const getCategory = async (req, res) => {
    try
    {
        const categories = await Category.find();
        res.status(200).send({ message: "All categories", categories });
    }catch(error)
    {
        res.status(500).send({ message: "An Error Occurred",error });
    }
};