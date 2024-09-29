import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Base User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Customer", "Admin", "DeliveryPartner"],
        required: true,
    },
    isActivated: {
        type: Boolean,
        default: true,
    }
});

// Customer Schema
const customerSchema = new mongoose.Schema({
    ...userSchema.obj,
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["Customer"],
        default: "Customer",
    },
    liveLocation: {
        lattitude: { type: Number },
        longitude: { type: Number },
    },
    address: {
        type: String,
    }
})

// Delivery Partner Schema
const deliveryPartnerSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["DeliveryPartner"],
        default: "DeliveryPartner",
    },
    liveLocation: {
        lattitude: { type: Number },
        longitude: { type: Number },
    },
    address: {
        type: String,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
    }
})

// Pre-save hook to hash password before saving
deliveryPartnerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Admin Schema
const adminSchema = new mongoose.Schema({
    ...userSchema.obj,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        unique: true,
    },
    role: {
        type: String,
        enum: ["Admin"],
        default: "Admin",
    }
})

// Pre-save hook to hash password for Admin schema
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

deliveryPartnerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const Customer = mongoose.model("Customer", customerSchema);
export const DeliveryPartner = mongoose.model("DeliveryPartner", deliveryPartnerSchema);
export const Admin = mongoose.model("Admin", adminSchema);
