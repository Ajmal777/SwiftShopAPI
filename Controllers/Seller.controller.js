const Seller = require("../Models/Seller");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const APIError = require("../util/APIError");
const {
    validateRegisterSeller,
    validateLogin,
} = require("../ValidationFunctions/validate");

const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

const registerSeller = async (data) => {
    const { name, sellerName, email, password, about, sellerProfileImg } = data;

    const { error } = validateRegisterSeller(data);
    if (error) throw new APIError(error.message, 400);

    // Check if the seller name or seller email already exists or not
    const check = await Seller.find({ $or: [{ name }, { email }] });
    if (check.length > 0) {
        throw new APIError("Conflict: Email or username already exists", 409);
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    const sellerObj = new Seller({
        name,
        sellerName,
        email,
        about,
        sellerProfileImg,
        password: hashedPassword,
    });

    await sellerObj.save();
    return {
        status: 201,
        message: "Registration successful",
    };
};

const loginSeller = async (email, password) => {
    const { error } = validateLogin({ email, password });
    if (error) throw new APIError(error.message, 400);

    // Check if the seller with given email exists
    let sellerData = await Seller.findOne({ email });
    if (!sellerData) {
        throw new APIError(
            "Not Found: Incorrect email / User doesn't exists",
            404
        );
    }

    // Check whether password is correct or not
    const check = await bcrypt.compare(password, sellerData.password);

    if (!check) {
        throw new APIError("Incorrect password", 401);
    }

    const payload = {
        name: sellerData.name,
        sellerName: sellerData.sellerName,
        email,
        sellerId: sellerData._id,
    };

    // Generate a new token and send it to the client
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return {
        status: 200,
        message: "Login successful",
        token: token,
    };
};

const editSeller = async (sellerId, data) => {
    const {
        name,
        sellerName,
        email,
        oldPassword,
        newPassword,
        about,
        sellerProfileImg,
    } = data;

    const { error } = Joi.object({
        name: Joi.string(),
        sellerName: Joi.string(),
        email: Joi.string().email(),
        oldPassword: Joi.string().min(8),
        newPassword: Joi.string().min(8),
        about: Joi.string(),
        sellerProfileImg: Joi.string(),
    }).validate(data);

    if (error) {
        throw new APIError(error.message, 400);
    }

    let updateObj = {};
    if (name) {
        updateObj.name = name;
    }
    if (sellerName) {
        const check = await Seller.find({ sellerName });
        if (check.length > 0) {
            throw new APIError("Conflict: Account name already exists", 409);
        }
        updateObj.sellerName = sellerName;
    }
    if (email) {
        const check = await Seller.find({ email });
        if (check.length > 0) {
            throw new APIError("Conflict: Email already exists", 409);
        }
        updateObj.email = email;
    }
    if (newPassword) {
        if (!oldPassword) {
            throw new APIError("Old password is required", 400);
        }
        if (oldPassword === newPassword) {
            throw new APIError("New password is same as old password", 422);
        }

        const sellerData = await Seller.findById(sellerId);

        const check = await bcrypt.compare(oldPassword, sellerData.password);

        if (!check) {
            throw new APIError("Incorrect old password", 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);
        updateObj.password = hashedPassword;
    }
    if (about) {
        updateObj.about = about;
    }
    if (sellerProfileImg) {
        updateObj.sellerProfileImg = sellerProfileImg;
    }

    await Seller.findByIdAndUpdate(sellerId, updateObj);
    return {
        status: 200,
        message: "Profile updated successfully",
    };
};

const deleteSeller = async (sellerId) => {
    const response = await Seller.findByIdAndDelete(sellerId);
    if (!response) {
        throw new APIError("Not Found: Seller not found", 404);
    }
    return {
        status: 200,
        message: "Deleted account successfully.",
    };
};

module.exports = { registerSeller, loginSeller, editSeller, deleteSeller };
