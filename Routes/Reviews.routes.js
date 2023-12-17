const { isAuth } = require("../middlewares/Authenticate");
const {
    postReview,
    likeReview,
    dislikeReview,
    saveReview,
    unSaveReview,
    editReview,
    deleteReview,
    getProductReviews,
    getUserReviews,
    unLikeReview,
    unDislikeReview,
} = require("../Controllers/Reviews.controller");
const asyncHandler = require("../middlewares/asyncHandler");

const router = require("express").Router();

router.post("/:productId", isAuth, asyncHandler((req, res) => {
    const { userId, userName } = req.locals;
    const { productId } = req.params
    return postReview(userId, userName, productId, req.body);
}));

router.put('/:reviewId', isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return editReview(userId, reviewId, req.body);
}));

router.delete('/:reviewId', isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return deleteReview(userId, reviewId);
}));

router.post("/like/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return likeReview(userId, reviewId);
}));

router.delete("/like/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return unLikeReview(userId, reviewId);
}))

router.post("/dislike/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return dislikeReview(userId, reviewId);
}));

router.delete("/dislike/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return unDislikeReview(userId, reviewId);
}))

router.post("/save/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return saveReview(userId, reviewId);
}));

router.delete("/save/:reviewId", isAuth, asyncHandler((req, res) => {
    const { reviewId } = req.params;
    const { userId } = req.locals;
    return unSaveReview(userId, reviewId);
}));

router.get('/:productId/product', isAuth, asyncHandler((req, res) => {
    const { productId } = req.params;
    return getProductReviews(productId);
}));

// Fetches all the reviews made by a user
router.get('/:userId/user', isAuth, asyncHandler((req, res) => {
    const { userId } = req.params;
    return getUserReviews(userId);
}));
module.exports = router;
