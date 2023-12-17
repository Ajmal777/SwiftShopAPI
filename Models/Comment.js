const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    authorId: {
        type: String,
        require: true,
    },
    authorName: {
        type: String,
        require: true,
    },
    dateOfComment: {
        type: Date,
        require: true,
    },
    likes: Number,
    dislikes: Number,
    text: String,
    replies: [
        {
            type: String,
            ref: "comments",
        },
    ],
});

module.exports = mongoose.model("comments", CommentSchema);
