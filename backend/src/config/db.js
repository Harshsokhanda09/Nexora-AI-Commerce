import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // 🔥 connection event listeners
        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        mongoose.connection.on("reconnected", () => {
            console.warn("⚠️ MongoDB reconnected");
        });

    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB;