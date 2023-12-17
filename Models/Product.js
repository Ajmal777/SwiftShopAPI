const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    product_name: {
        type: String,
        require: true,
    },
    product_desc: {
        type: String,
        require: true,
    },
    product_price: {
        type: Number,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    product_category: {
        type: String,
        require: true,
    },
    product_images: [
        {
            type: String,
        },
    ],
    avg_rating: {
        type: Number,
        default: 0,
    },
    product_reviews: [{ type: String, ref: "reviews" }],
    sellerId: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("products", ProductSchema);