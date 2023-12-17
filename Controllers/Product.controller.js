const Product = require("../Models/Product");
const Review = require("../Models/Review");
const User = require("../Models/User");
const { validateProductDetails } = require("../ValidationFunctions/validate");
const APIError = require("../util/APIError");

const fetchProducts = async (filterObj, queryObj) => {
    const { price = {}, rating } = filterObj;
    const { query, page = 1, perPage = 5 } = queryObj;
    const { minPrice = 0, maxPrice = Infinity } = price;

    const pipeline = [];

    if (rating) {
        pipeline.push({ $match: { avg_rating: { $gte: rating } } });
    }
    if (query) {
        pipeline.push({
            $match: { product_name: new RegExp(query, "i") },
        });
    }
    if (price) {
        pipeline.push({
            $match: { product_price: { $gte: minPrice, $lte: maxPrice } },
        });
    }
    if (page) {
        pipeline.push(
            { $skip: (page - 1) * perPage },
            { $limit: perPage }
        );
    }

    let productsList = await Product.aggregate(pipeline);
    productsList = await Review.populate(productsList, {path: "product_reviews"});

    if (productsList.length == 0) {
        throw new APIError("No items found", 404);
    }

    return {
        status: 200,
        message: "Items retrieved successfully",
        data: productsList,
    };
};

const createProduct = async (sellerId, data) => {
    const { error } = validateProductDetails(data);
    if (error) throw new APIError(error.message, 400);

    const productObj = new Product({ ...data, sellerId });

    const copy = await productObj.save();
    return {
        status: 201,
        message: "Product created successfully",
        data: copy,
    };
};

const deleteProduct = async (sellerId, productId) => {
    // check whether the product is owned by the seller trying to delete it

    const product = await Product.findById(productId);
    if (!product) {
        throw new APIError("Product not found", 404);
    }

    if (product.sellerId !== sellerId) {
        throw new APIError(
            "Forbidden: You are not authorized to delete this product",
            403
        );
    }

    await Product.findByIdAndDelete(productId);

    return {
        status: 200,
        message: "Product successfully deleted",
    };
};

const updateProduct = async (sellerId, productId, updateObj) => {
    const {
        product_name,
        product_desc,
        product_price,
        stock,
        product_category,
        product_images,
    } = updateObj;

    // Check whether the product exists or not and fetch.
    let productData = await Product.findById(productId);
    if (!productData) {
        throw new APIError("Product not found", 404);
    }

    if (productData.sellerId !== sellerId) {
        throw new APIError(
            "Forbidden: You are not authorized to modify this product",
            403
        );
    }

    const updatedData = {
        product_name: product_name ?? productData.product_name,
        product_desc: product_desc ?? productData.product_desc,
        product_price: product_price ?? productData.product_price,
        stock: stock ?? productData.stock,
        product_category: product_category ?? productData.product_category,
        product_images: product_images ?? productData.product_images,
    };

    //   update the document in the database
    await Product.findByIdAndUpdate(productId, updatedData);

    return {
        status: 200,
        message: "Product updated successfully",
    };
};

const addToCart = async (userId, productId) => {
    // check if it already exists in the cart
    const existsInCart = await User.findOne({
        _id: userId,
        cart: { $elemMatch: { product_id: productId } },
    });

    if (existsInCart) {
        throw new APIError("Conflict: The product is already in the cart", 409);
    }

    // Check if the product exists in the collection
    const check = await Product.findById(productId);
    if (!check) {
        throw new APIError("Product Not found", 404);
    }

    await User.findByIdAndUpdate(userId, {
        $push: { cart: { product_id: productId, dateAdded: Date.now() } },
    });

    return {
        status: 200,
        message: "Product added to cart successfully",
    };
};

const removeFromCart = async (userId, productId) => {
    const existsInCart = await User.findOne({
        _id: userId,
        cart: { $elemMatch: { product_id: productId } },
    });

    if (!existsInCart) {
        throw new APIError("Product not found in the cart", 404);
    }

    const check = await Product.findById(productId);
    if (!check) {
        throw new APIError("Product Not found", 404);
    }

    await User.findByIdAndUpdate(userId, {
        $pull: { cart: { product_id: productId } },
    });

    return {
        status: 200,
        message: "Product removed from cart successfully",
    };
};

const clearCart = async (userId) => {
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    return {
        status: 200,
        message: "Cart cleared successfully",
    };
};

const addToWishlist = async (userId, productId) => {
    const existsInWl = await User.findOne({
        _id: userId,
        wishlist: { $in: [productId] },
    });
    if (existsInWl) {
        throw new APIError(
            "Conflict: The product is already in the wishlist",
            409
        );
    }

    const check = await Product.findById(productId);
    if (!check) {
        throw new APIError("Product Not found", 404);
    }

    await User.findByIdAndUpdate(userId, {
        $push: { wishlist: productId },
    });
    return {
        status: 200,
        message: "Product added to wishlist successfully",
    };
};

const removeFromWishlist = async (userId, productId) => {
    const existsInWl = await User.findOne({
        _id: userId,
        wishlist: { $in: [productId] },
    });

    if (!existsInWl) {
        throw new APIError("Product not found in the wishlist", 404);
    }

    const check = await Product.findById(productId);
    if (!check) {
        throw new APIError("Product Not found", 404);
    }

    await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: productId },
    });

    return {
        status: 200,
        message: "Product removed from wishlist successfully",
    };
};

const clearWishlist = async (userId) => {
    await User.findByIdAndUpdate(userId, { $set: { wishlist: [] } });
    return {
        status: 200,
        message: "Wishlist cleared successfully",
    };
};

module.exports = {
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
};
