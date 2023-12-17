const Joi = require("joi");
const Product = require("../Models/Product");
const Review = require("../Models/Review");
const User = require("../Models/User");
const { validateUserReview } = require("../ValidationFunctions/validate");
const APIError = require("../util/APIError");

const postReview = async (userId, userName, productId, reviewData) => {
    const { rating, title, body } = reviewData;

    if (!productId) throw new APIError("Product Id required", 400);

    // Input Validation
    const { error } = validateUserReview(reviewData);
    if (error) throw new APIError(error.message, 400);

    // Get the product data
    let productData = await Product.findById(productId).populate(
        "product_reviews"
    );

    if (!productData) {
        throw new APIError(
            "Not Found: The product does not exist / Invalid product Id",
            404
        );
    }

    // Get average ratings
    const ratings =
        productData.product_reviews?.map((review) => review.rating) || [];
    ratings.push(rating);
    const averageRating =
        ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

    // Post the review
    const reviewObj = new Review({
        authorId: userId,
        authorName: userName,
        dateOfReview: Date.now(),
        likes: 0,
        dislikes: 0,
        replies: [],
        rating,
        title,
        body,
    });

    const data = await reviewObj.save();
    let reviewId = data._id;

    // Update the product data with new review

    await Product.findByIdAndUpdate(productId, {
        $push: { product_reviews: reviewId },
        avg_rating: averageRating,
    });

    return {
        status: 201,
        message: "Review created successfully",
        data: data,
    };
};

const editReview = async (userId, reviewId, editObj) => {
    const { rating, title, body } = editObj;

    const { error } = Joi.object({
        rating: Joi.number(),
        title: Joi.string().min(1),
        body: Joi.string().min(1),
    }).validate(editObj);

    if (error) throw new APIError(error.message, 400);

    if (!reviewId) {
        throw new APIError("Review ID required", 400);
    }

    // Check if the user is the author of the review
    const reviewData = await Review.findById(reviewId);
    if (reviewData.authorId != userId) {
        throw new APIError(
            "Forbidden: You are not authorized to edit this review",
            403
        );
    }

    // Update data with new values if they exists, else keep the old values.
    const updateObj = {
        rating: rating ?? reviewData.rating,
        title: title ?? reviewData.title,
        body: body ?? reviewData.body,
    };

    const copy = await Review.findByIdAndUpdate(reviewId, updateObj);
    return {
        status: 200,
        message: "Review updated successfully",
        data: copy,
    };
};

const deleteReview = async (userId, reviewId) => {
    const reviewData = await Review.findById(reviewId);

    if (reviewData.authorId != userId) {
        throw new APIError(
            "Forbidden: You are not authorized to delete this review",
            403
        );
    }

    await Review.findByIdAndDelete(reviewId);
    return {
        status: 200,
        message: "Review deleted successfully",
    };
};

const likeReview = async (userId, reviewId) => {
    // Remove the review from disliked_reviews list (if it exists in the list),
    // then add it to the liked reviews list.
    // Followed by updating the likes count of the review

    const check = await User.findOne({
        _id: userId,
        liked_reviews: { $in: [reviewId] },
    });

    if (check) {
        throw new APIError("Conflict: You have already liked this review", 409);
    }

    // Check if the user has already disliked the review or not
    const dislikeCheck = await User.findOne({
        _id: userId,
        disliked_reviews: { $in: [reviewId] },
    });

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $push: { liked_reviews: reviewId },
            $pull: { disliked_reviews: reviewId },
        }),
        // If the user has already disliked the review, then reduce it. And increase the like count.
        Review.findByIdAndUpdate(reviewId, {
            $inc: { likes: 1, dislikes: dislikeCheck ? -1 : 0 },
        }),
    ]);

    return {
        status: 200,
        message: "Review liked successfully",
    };
};

const unLikeReview = async (userId, reviewId) => {
    const check = await User.findOne({
        _id: userId,
        liked_reviews: { $in: [reviewId] },
    });
    if (!check) throw new APIError("You have not liked this review", 400);

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $pull: { liked_reviews: reviewId },
        }),
        Review.findByIdAndUpdate(reviewId, {
            $inc: { likes: -1 },
        }),
    ]);

    return {
        status: 200,
        message: "Review removed from likes list successfully",
    };
};

const dislikeReview = async (userId, reviewId) => {
    // Remove the review from liked_reviews list (if it exists in the list),
    // then add it to the disliked reviews list.
    // Followed by updating the dislikes count of the review

    const check = await User.findOne({
        _id: userId,
        disliked_reviews: { $in: [reviewId] },
    });

    if (check) {
        throw new APIError(
            "Conflict: You have already disliked this review",
            409
        );
    }

    // Check if the user has already liked the review or not
    const likeCheck = await User.findOne({
        _id: userId,
        liked_reviews: { $in: [reviewId] },
    });

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $push: { disliked_reviews: reviewId },
            $pull: { liked_reviews: reviewId },
        }),
        // If the user has already liked the review, then reduce it. And increase the dislike count.
        Review.findByIdAndUpdate(reviewId, {
            $inc: { dislikes: 1, likes: likeCheck ? -1 : 0 },
        }),
    ]);

    return {
        status: 200,
        message: "Review disliked successfully",
    };
};

const unDislikeReview = async (userId, reviewId) => {
    const check = await User.findOne({
        _id: userId,
        disliked_reviews: { $in: [reviewId] },
    });

    if (!check) throw new APIError("You have not disliked this revie", 400);

    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $pull: { disliked_reviews: reviewId },
        }),
        Review.findByIdAndUpdate(reviewId, { $inc: { dislikes: -1 } }),
    ]);

    return {
        status: 200,
        message: 'Review removed from dislikes list successfully'
    }
};

const saveReview = async (userId, reviewId) => {
    // Check if the user has already saved the review or not. It's to prevent duplication.
    const check = await User.findOne({
        _id: userId,
        saved_reviews: { $in: [reviewId] },
    });

    if (check) {
        throw new APIError("Conflict: You have already saved this review", 409);
    }

    // Push the review Id in the saved reviews array of the user.
    await User.findByIdAndUpdate(userId, {
        $push: { saved_reviews: reviewId },
    });
    return {
        status: 200,
        message: "Review saved successfully",
    };
};

const unSaveReview = async (userId, reviewId) => {
    // Check if the user has saved the review.
    const check = await User.findOne({
        _id: userId,
        saved_reviews: { $in: [reviewId] },
    });

    if (!check) {
        throw new APIError("Not Found: You have not saved this review", 404);
    }
    // If the review exists in the saved reviews array, then remove it.
    await User.findByIdAndUpdate(userId, {
        $pull: { saved_reviews: reviewId },
    });

    return {
        status: 200,
        message: "Review unsaved successfully",
    };
};

const getProductReviews = async (productId) => {
    const productData = await Product.findById(productId, {
        product_reviews: 1,
    }).populate("product_reviews");

    return {
        status: 200,
        message: "Reviews fetched",
        data: productData,
    };
};

const getUserReviews = async (userId) => {
    const userReviews = await Review.find({ authorId: userId }, { replies: 0 });

    return {
        status: 200,
        message: "Successfully fetched all user reviews",
        data: userReviews,
    };
};

module.exports = {
    postReview,
    editReview,
    deleteReview,
    likeReview,
    unLikeReview,
    dislikeReview,
    unDislikeReview,
    saveReview,
    unSaveReview,
    getProductReviews,
    getUserReviews,
};
