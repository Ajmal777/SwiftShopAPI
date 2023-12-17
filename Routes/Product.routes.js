const router = require("express").Router();

const {
    createProduct,
    deleteProduct,
    updateProduct,
    fetchProducts,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = require("../Controllers/Product.controller");
const { isAuth } = require("../middlewares/Authenticate");
const { isSeller } = require("../middlewares/isSeller");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", isAuth, asyncHandler((req, res) => {
    return fetchProducts(req.body, req.query);
}));

router.post("/create", isAuth, isSeller, asyncHandler((req, res) => {
    const { sellerId } = req.locals;
    return createProduct(sellerId, req.body);
}));

router.delete("/delete/:productId", isAuth, isSeller, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { sellerId } = req.locals;
    return deleteProduct(sellerId, productId);
}));

router.put("/update/:productId", isAuth, isSeller, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { sellerId } = req.locals;
    return updateProduct(sellerId, productId,req.body);
}));

router.post("/cart/:productId", isAuth, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { userId } = req.locals;
    return addToCart(userId, productId);
}));

router.delete("/cart/:productId", isAuth, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { userId } = req.locals;
    return removeFromCart(userId, productId);
}));

router.delete("/cart", isAuth, asyncHandler((req, res) => {
    const { userId } = req.locals;
    return clearCart(userId);
}));

router.post("/wishlist/:productId", isAuth, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { userId } = req.locals;
    return addToWishlist(userId, productId);
}));

router.delete("/wishlist/:productId", isAuth, asyncHandler((req, res) => {
    const { productId } = req.params;
    const { userId } = req.locals;
    return removeFromWishlist(userId, productId);
}));

router.delete("/wishlist", isAuth, asyncHandler((req, res) => {
    const { userId } = req.locals;
    return clearWishlist(userId);
}));

module.exports = router;
