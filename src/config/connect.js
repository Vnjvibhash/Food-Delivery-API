import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async (uri) => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ❤️`);
    } catch (error) {
        console.error(`Error: 💔${error.message}`);
        process.exit(1);
    }
}