const Joi = require("joi");

// Validation functions for user
const validateRegisterUser = (userData) => {
  return Joi.object({
    userProfileImg: Joi.string(),
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(userData);
};

const validateLogin = (data) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }).validate(data);
};

// validation functions for seller
const validateRegisterSeller = (sellerData) => {
  return Joi.object({
    sellerProfileImg: Joi.string(),
    name: Joi.string().required(),
    sellerName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    about: Joi.string(),
  }).validate(sellerData);
};

// validation functions for products
const validateProductDetails = (productData) => {
  return Joi.object({
    product_name: Joi.string().required(),
    product_desc: Joi.string().required(),
    product_price: Joi.number().required(),
    stock: Joi.number().required(),
    product_category: Joi.string().required(),
    product_images: Joi.array().items(Joi.string()),
  }).validate(productData);
};

const validateUserReview = (data) => {
  return Joi.object({
    rating: Joi.number(),
    title: Joi.string().required(),
    body: Joi.string().required(),
  }).validate(data);
}

module.exports = {
  validateRegisterUser,
  validateLogin,
  validateRegisterSeller,
  validateLogin,
  validateProductDetails,
  validateUserReview,
};
