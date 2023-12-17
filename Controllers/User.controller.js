const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    validateRegisterUser,
    validateLogin,
} = require("../ValidationFunctions/validate");
const User = require("../Models/User");
const APIError = require("../util/APIError");

const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

const registerUser = async (data) => {
    const { userProfileImg, name, userName, email, password } = data;

    //   Check whether the user input are valid or not
    const { error } = validateRegisterUser(data);

    if (error) {
        throw new APIError(error.message, 400);
    }

    //   Checks if the user already exists or not

    const check = await User.find({ $or: [{ userName }, { email }] });
    if (check.length > 0) {
        throw new APIError("Conflict: Email or username already exists", 409);
    }

    //   Encrypt user password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

    const userObj = new User({
        userProfileImg,
        name,
        userName,
        email,
        password: hashedPassword,
    });

    //   Save the user data into the database - Successfully register the user

    await userObj.save();

    return {
        status: 201,
        message: "Registration successful",
    };
};

const loginUser = async (email, password) => {
    const { error } = validateLogin({ email, password });
    if (error) throw new APIError(error.message, 400);

    // Checks whether the user with given email exists or not
    let userData = await User.findOne({ email });
    if (!userData) {
        throw new APIError(
            "Not Found: Incorrect email / User doesn't exists",
            404
        );
    }

    // Checks whether the password matches the encrypted password inside the database
    const check = await bcrypt.compare(password, userData.password);

    if (!check) {
        throw new APIError("Incorrect password", 401);
    }

    // Creates a token using jsonwebtoken and it is sent to the client.
    const payload = {
        name: userData.name,
        userName: userData.userName,
        email,
        userId: userData._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

    return {
        status: 200,
        message: "Login successful",
        token: token,
    };
};

const editUser = async (userId, data) => {
    const { name, userName, email, oldPassword, newPassword, userProfileImg } =
        data;

    const { error } = Joi.object({
        name: Joi.string(),
        userName: Joi.string(),
        email: Joi.string().email(),
        oldPassword: Joi.string().min(8),
        newPassword: Joi.string().min(8),
        sellerProfileImg: Joi.string(),
    }).validate(data);

    if (error) {
        throw new APIError(error.message, 400);
    }

    let updateObj = {};
    if (name) {
        updateObj.name = name;
    }
    if (userName) {
        const check = await User.find({ userName });
        if (check.length > 0) {
            throw new APIError("Conflict: Account name already exists", 409);
        }
        updateObj.userName = userName;
    }
    if (email) {
        const check = await User.find({ email });
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

        // Check whether the current password is valid or not
        const userObj = await User.findById(userId);
        const checkPassword = await bcrypt.compare(
            oldPassword,
            userObj.password
        );

        if (!checkPassword) {
            throw new APIError("Incorrect old password", 400);
        }

        // Encrypt the new Password and update it
        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);
        updateObj.password = hashedPassword;
    }
    if (userProfileImg) {
        updateObj.userProfileImg = userProfileImg;
    }

    await User.findByIdAndUpdate(userId, updateObj);
    return {
        status: 200,
        message: "Profile updated successfully",
    };
};

const deleteUser = async (userId) => {
    const response = await User.findByIdAndDelete(userId);
    if (!response) {
        throw new APIError("Not Found: User not found", 404);
    }

    return {
        status: 200,
        message: "Deleted account successfully.",
    };
};

module.exports = {
    registerUser,
    loginUser,
    editUser,
    deleteUser,
};
