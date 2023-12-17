const router = require('express').Router();

const { registerSeller, loginSeller, editSeller, deleteSeller } = require('../Controllers/Seller.controller');
const { isAuth } = require('../middlewares/Authenticate');
const asyncHandler = require('../middlewares/asyncHandler');
const { isSeller } = require('../middlewares/isSeller');

router.post('/register', asyncHandler((req, res) => {
    return registerSeller(req.body);
}));

router.post('/login', asyncHandler((req, res) => {
    const { email, password } = req.body;
    return loginSeller(email, password);
}));

router.put('/edit', isAuth, isSeller, asyncHandler((req, res) => {
    const { sellerId } = req.locals;
    return editSeller(sellerId, req.body);
}));

router.delete('/delete', isAuth, isSeller, asyncHandler((req, res) => {
    const sellerId = req.locals;
    return deleteSeller(sellerId);
}));

module.exports = router;