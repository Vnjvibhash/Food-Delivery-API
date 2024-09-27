import { Branch } from "../../models/branch.js";
import { Customer, DeliveryPartner } from "../../models/users.js";
import { Order } from "../../models/order.js";

export const createOrder = async (req, res) => {
    try {
        const { userId } = req.user;
        const { branchId, orderItems, totalAmount, paymentMethod, paymentStatus } = req.body;

        const customerDetails = await Customer.findById(userId);
        if (!customerDetails) {
            return res.status(404).send({ message: "Customer not found" });
        }

        const branchDetails = await Branch.findById(branchId);
        if (!branchDetails) {
            return res.status(404).send({ message: "Branch not found" });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).send({ message: "No order items provided" });
        }

        let calculatedTotalAmount = orderItems.reduce((total, item) => {
            return total + (item.price * item.count);
        }, 0);

        calculatedTotalAmount = totalAmount || calculatedTotalAmount;

        const newOrder = new Order({
            customerId: userId,
            orderItems: orderItems.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branchId,
            deliveryLocation: {
                lattitude: customerDetails.liveLocation?.lattitude || 0,
                longitude: customerDetails.liveLocation?.longitude || 0,
                address: customerDetails.address || "Not Provided"
            },
            pickupLocation: {
                lattitude: branchDetails.liveLocation?.lattitude || 0,
                longitude: branchDetails.liveLocation?.longitude || 0,
                address: branchDetails.address || "Not Provided"
            },
            totalAmount: calculatedTotalAmount,
            paymentMode: paymentMethod,
            paymentStatus: paymentStatus
        });

        await newOrder.save();
        console.log(newOrder);

        return res.status(201).send({ message: "Order created successfully", newOrder });

    } catch (error) {
        console.error("Order creation error:", error);
        return res.status(500).send({ message: "Failed to create order", error });
    }
};

export const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPersonLocation } = req.body;
        
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return res.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        if (order.orderStatus !== "available") {
            return res.status(400).send({ message: "Order is not available" });
        }
        order.orderStatus = "confirmed";
        console.log(order.orderStatus, userId);
        order.deliveryPartnerId = userId;
        order.deliveryPersonLocation = {
            lattitude: deliveryPersonLocation?.lattitude,
            longitude: deliveryPersonLocation?.longitude,
            address: deliveryPersonLocation.address || "Not Provided"
        };
        await order.save();
        req.server.io.to(orderId).emit("orderConfirmed", order);
        return res.status(200).send({ message: "Order confirmed successfully", order });

    } catch (error) {
        return res.status(500).send({ message: "Faild to confirm order", error });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, deliveryPersonLocation } = req.body;
        
        const { userId } = req.user;
        const deliveryPerson = await DeliveryPartner.findById(userId);
        if (!deliveryPerson) {
            return res.status(404).send({ message: "Delivery Person not found" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        if (["cancelled", "delivered"].includes(orderStatus)) {
            return res.status(400).send({ message: "Order can not be updated" });
        }

        console.log(order.deliveryPartnerId.toString(), userId);
        if (order.deliveryPartnerId.toString() !== userId) {
            return res.status(403).send({ message: "You are not authorized to update this order" });
        }

        order.orderStatus = orderStatus;
        order.deliveryPersonLocation = {
            lattitude: deliveryPersonLocation?.lattitude,
            logitude: deliveryPersonLocation?.logitude,
            address: deliveryPersonLocation.address || "Not Provided"
        }

        await order.save();
        req.server.io.to(orderId).emit("livetrackingUpdates", order);
        return res.status(200).send({ message: "Order updated successfully", order });
    } catch (error) {
        return res.status(500).send({ message: "Faild to update order", error });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { orderStatus, customerId, branchId, deliveryPersonId } = req.query;
        let query = {};
        if (orderStatus) {
            query.orderStatus = orderStatus;
        }
        if (customerId) {
            query.customerId = customerId;
        }
        if (branchId) {
            query.branchId = branchId;
        }
        if (deliveryPersonId) {
            query.deliveryPartnerId = deliveryPersonId;
            query.branchId = branchId;
        }
        const orders = await Order.find(query).populate("customerId branchId orderItems.item deliveryPartnerId");
        return res.status(200).send({ message: "All orders",  orders });
    } catch (error) {
        return res.status(500).json({ message: "Faild to get orders",  error });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("customerId branchId orderItems.item deliveryPartnerId");
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }
        return res.status(200).send({ message: "Order retrieved successfully", order });
    } catch (error) {
        return res.status(500).send({ message: "Faild to get order", error });
    }
};
