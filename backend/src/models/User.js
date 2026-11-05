import mongoose from "mongoose";
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    cart: {
        type: Object,
        default: {}
    }
}, {timestamps: true, minimize: false});

export default mongoose.model("User", userSchema);