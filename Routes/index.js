const router = require('express').Router();

const userRoutes = require('./User.routes');
const sellerRoutes = require('./Seller.routes');
const reviewRoutes = require('./Reviews.routes');
const productRoutes = require('./Product.routes');
const commentRoutes = require('./Comments.routes');


router.use(['/user', '/users'], userRoutes);
router.use(['/seller', '/sellers'], sellerRoutes);
router.use(['/review', '/reviews'], reviewRoutes);
router.use(['/product', '/products'], productRoutes);
router.use(['/comment', '/comments'], commentRoutes);

module.exports = router;