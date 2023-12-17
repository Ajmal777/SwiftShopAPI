const {
    reply,
    editComment,
    deleteComment,
    likeComment,
    dislikeComment,
    saveComment,
    unsaveComment,
    unLikeComment,
    unDislikeComment,
} = require("../Controllers/Comments.controller");
const { isAuth } = require("../middlewares/Authenticate");
const asyncHandler = require("../middlewares/asyncHandler");

const router = require("express").Router();

router.post("/reply", isAuth, asyncHandler((req, res) => {
    const { userId, userName } = req.locals;
    return reply(userId, userName, req.body)
}));

router.put("/edit", isAuth, asyncHandler((req, res) => {
    const { userId } = req.locals;
    return editComment(userId, req.body);
}));

router.delete("/delete/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return deleteComment(userId, commentId);
}));

router.post("/like/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return likeComment(userId, commentId);
}));

router.delete("/like/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return unLikeComment(userId, commentId);
}));

router.post("/dislike/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return dislikeComment(userId, commentId);
}));

router.delete("/dislike/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return unDislikeComment(userId, commentId);
}))

router.post("/save/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return saveComment(userId, commentId);
}));

router.delete("/save/:commentId", isAuth, asyncHandler((req, res) => {
    const { commentId } = req.params;
    const { userId } = req.locals;
    return unsaveComment(userId, commentId);
}));

module.exports = router;
