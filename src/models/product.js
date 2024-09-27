import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    mrpPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
        default: "Discover a seamless food ordering experience with our app, connecting you to your favorite local restaurants and cuisines. Whether you're craving a quick snack or a full meal, simply browse through a wide variety of options, customize your order, and have it delivered right to your doorstep.With real- time tracking, secure payments, and easy reordering, you can enjoy your meals hassle- free.Our user - friendly interface ensures that you can find what you want in seconds, while exclusive deals and promotions help you save.Satisfy your cravings anytime, anywhere with fast, reliable delivery and excellent service.",
        trim: true
    },
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
