import mongoose from 'mongoose';
import { Counter } from './counter.js';

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    deliveryPartnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryPartner',
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
        default: "available"
    },
    orderItems: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        count: {
            type: Number,
            required: true
        }
    }],
    deliveryLocation: {
        lattitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String
        }
    },
    pickupLocation: {
        lattitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        address: {
            type: String
        }
    },
    deliveryPersonLocation: {
        lattitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        address: {
            type: String
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ["COD", "Online"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid"
    },
    paymentDetails: {
        type: String
    },
}, { timestamps: true });

async function getNextSequenceValue(sequenceName) {
    const sequenceDoc = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDoc.sequence_value;
}

orderSchema.pre('save', async function (next) {
    if(this.isNew)
    {
        const sequenceValue = await getNextSequenceValue('orderId');
        this.orderId = 'ORDR' + sequenceValue.toString().padStart(6, '0');
    }
    next();
});

export const Order = mongoose.model('Order', orderSchema);
