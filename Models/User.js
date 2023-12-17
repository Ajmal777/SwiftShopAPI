const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    userName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    userProfileImg: String,
    saved_comments: [
        {
            type: String,
            ref: "comments",
        },
    ],
    liked_comments: [
        {
            type: String,
            ref: "comments",
        },
    ],
    disliked_comments: [
        {
            type: String,
            ref: "comments",
        },
    ],
    saved_reviews: [
        {
            type: String,
            ref: "reviews",
        },
    ],
    liked_reviews: [
        {
            type: String,
            ref: "reviews",
        },
    ],
    disliked_reviews: [
        {
            type: String,
            ref: "reviews",
        },
    ],
    cart: [
        {
            product_id: {
                type: String,
                ref: "products",
            },
            dateAdded: Date,
        },
    ],
    wishlist: [
        {
            type: String,
            ref: 'products',
        }
    ]
});

module.exports = mongoose.model("users", UserSchema);
