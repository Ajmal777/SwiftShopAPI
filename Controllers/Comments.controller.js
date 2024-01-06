const Joi = require("joi");
const Review = require("../Models/Review");
const Comment = require("../Models/Comment");
const User = require("../Models/User");
const APIError = require("../util/APIError");

const reply = async (userId, userName, data) => {
    // Either reviewId or parentCommentId will be there.
    // Both at same time is not allowed
    // Both review and comment has different collections, hence only one at a time is allowed
    const { comment, reviewId, parentCommentId } = data;

    const { error } = Joi.string().min(1).validate(comment);
    if (error) throw new APIError(error.message, 400);

    const commentObj = new Comment({
        authorId: userId,
        authorName: userName,
        dateOfComment: Date.now(),
        likes: 0,
        dislikes: 0,
        text: comment,
    });
    const commentData = await commentObj.save();
    const commentId = commentData._id;

    if (parentCommentId) {
        const response = await Comment.findByIdAndUpdate(parentCommentId, {
            $push: { replies: commentId },
        });
        if (!response) throw new APIError("Comment not found", 404);
    } 
    else if(reviewId) {
        const response = await Review.findByIdAndUpdate(reviewId, {
            $push: { replies: commentId },
        });
        if (!response) throw new APIError("Review not found", 404);
    }
    else throw new APIError('reviewId / parentCommentId required.', 400);

    return {
        status: 201,
        message: "Reply created successfully",
        data: commentData,
    };
};

const editComment = async (userId, { text, commentId }) => {
    const { error } = Joi.string().min(1).validate(text);
    if (error) throw new APIError(error.message, 400);

    const check = await Comment.findById(commentId);
    if (check.authorId != userId) {
        throw new APIError(
            "Forbidden: You are not authorized to edit this comment",
            403
        );
    }
    await Comment.findByIdAndUpdate(commentId, { text });

    return {
        status: 200,
        message: "Comment updated successfully",
    };
};

const deleteComment = async (userId, commentId) => {
    const check = await Comment.findById(commentId);
    if (check.authorId != userId) {
        throw new APIError(
            "Forbidden: You are not authorized to delete this comment",
            403
        );
    }
    await Comment.findByIdAndDelete(commentId);
    return {
        status: 200,
        message: "Comment deleted successfully",
    };
};

const likeComment = async (userId, commentId) => {
    // Remove the Comment from disliked_comments list (if it exists in the list),
    // then add it to the liked comments list.
    // Followed by updating the likes count of the comment

    const check = await User.findOne({
        _id: userId,
        liked_comments: { $in: [commentId] },
    });

    if (check) {
        throw new APIError(
            "Conflict: You have already liked this comment",
            409
        );
    }

    // Check if the user has already disliked the Comment or not
    const dislikeCheck = await User.findOne({
        _id: userId,
        disliked_comments: { $in: [commentId] },
    });

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $push: { liked_comments: commentId },
            $pull: { disliked_comments: commentId },
        }),
        // If the user has already disliked the Comment, then reduce it. And increase the like count.
        Comment.findByIdAndUpdate(commentId, {
            $inc: { likes: 1, dislikes: dislikeCheck ? -1 : 0 },
        }),
    ]);

    return {
        status: 200,
        message: "Comment liked successfully",
    };
};

const unLikeComment = async (userId, commentId) => {
    const check = await User.findOne({
        _id: userId,
        liked_comments: { $in: [commentId] },
    });

    if (!check) throw new APIError("You have not liked this comment", 400);

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $pull: { liked_comments: commentId },
        }),
        Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } }),
    ]);

    return {
        status: 200,
        message: "Comment removed from liked list",
    };
};

const dislikeComment = async (userId, commentId) => {
    // Remove the comment from liked_comments list (if it exists in the list),
    // then add it to the disliked comments list.
    // Followed by updating the dislikes count of the comment

    const check = await User.findOne({
        _id: userId,
        disliked_comments: { $in: [commentId] },
    });

    if (check) {
        throw new APIError(
            "Conflict: You have already disliked this comment",
            409
        );
    }

    // Check if the user has already liked the comment or not
    const likeCheck = await User.findOne({
        _id: userId,
        liked_comments: { $in: [commentId] },
    });

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $push: { disliked_comments: commentId },
            $pull: { liked_comments: commentId },
        }),
        // If the user has already liked the comment, then reduce it. And increase the dislike count.
        Comment.findByIdAndUpdate(commentId, {
            $inc: { dislikes: 1, likes: likeCheck ? -1 : 0 },
        }),
    ]);

    return {
        status: 200,
        message: "Comment disliked successfully",
    };
};

const unDislikeComment = async (userId, commentId) => {
    const check = await User.findOne({
        _id: userId,
        disliked_comments: { $in: [commentId] },
    });

    if(!check) throw new APIError("You have not disliked this comment", 400);

    await Promise.all([
        User.findByIdAndUpdate(userId, {$pull: {disliked_comments: commentId}}),
        Comment.findByIdAndUpdate(commentId, {$inc: {dislikes: -1}})
    ])

    return {
        status: 200,
        message: 'Removed comment from disliked comments list'
    }
};

const saveComment = async (userId, commentId) => {
    const check = await User.findOne({
        _id: userId,
        saved_comments: { $in: [commentId] },
    });

    if (check) {
        throw new APIError(
            "Conflict: You have already saved this comment",
            409
        );
    }
    await User.findByIdAndUpdate(userId, {
        $push: { saved_comments: commentId },
    });
    return {
        status: 200,
        message: "Comment saved successfully",
    };
};

const unsaveComment = async (userId, commentId) => {
    const check = await User.findOne({
        _id: userId,
        saved_comments: { $in: [commentId] },
    });

    if (!check) {
        throw new APIError("Not Found: You have not saved this comment", 404);
    }

    await User.findByIdAndUpdate(userId, {
        $pull: { saved_comments: commentId },
    });
    return {
        status: 200,
        message: "Comment unsaved successfully",
    };
};

module.exports = {
    reply,
    editComment,
    deleteComment,
    likeComment,
    unLikeComment,
    dislikeComment,
    unDislikeComment,
    saveComment,
    unsaveComment,
};
