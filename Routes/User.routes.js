const router = require("express").Router();
const { isAuth } = require("../middlewares/Authenticate");
const {
    registerUser,
    loginUser,
    editUser,
    deleteUser,
} = require("../Controllers/User.controller");
const asyncHandler = require("../middlewares/asyncHandler");

router.post("/register", asyncHandler((req, res) => {
    return registerUser(req.body);
}));

router.post("/login", asyncHandler((req, res) => {
    const { email, password } = req.body;
    return loginUser(email, password);
}));

router.put("/edit", isAuth, asyncHandler((req, res) => {
    const { userId } = req.locals;
    return editUser(userId, req.body);
}));

router.delete("/delete", isAuth, asyncHandler((req, res) => {
    const { userId } = req.locals;
    return deleteUser(userId);
}));

module.exports = router;
