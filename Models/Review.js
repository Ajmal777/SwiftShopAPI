const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({
    authorId: {
        type: String,
        require: true,
    },
    authorName: {
        type: String,
        require: true,
    },
    dateOfReview: {
        type: Date,
        require: true,
    },
    rating: Number,
    title: String,
    body: String,
    likes: Number,
    dislikes: Number,
    replies: [
        {
            type: String,
            ref: "comments",
        },
    ],
});

module.exports = mongoose.model("reviews", ReviewsSchema);
