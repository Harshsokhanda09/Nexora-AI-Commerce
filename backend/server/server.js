import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "../src/config/db.js";
import userRouter from "../src/routes/userRouter.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Checking server is working or not!
app.get("/", (req, res) => {
    res.send("Server is working fine!");
});

// Start server
const PORT = process.env.PORT || 6000;

// Mount router with prefix
app.use("/api/auth", userRouter);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on PORT: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();