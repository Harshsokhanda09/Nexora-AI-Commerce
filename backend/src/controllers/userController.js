import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT and save it in browser cookie
const generateToken = (userId, res) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV = "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}


// 1. Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 12);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashPassword
        });

        // Generate Token
        generateToken(user.id, res);

        return res.status(201).json({
            success: true,
            message: "User register successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });


    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// 2. Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // 2. Find existing user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3. Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 4. Generate JWT and set cookie
        generateToken(user._id, res);

        // 5. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// 3. Logout User
export const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};

// 4. Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }      

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};