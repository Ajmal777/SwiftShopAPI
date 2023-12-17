const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    sellerName: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    about: String,
    sellerProfileImg: String,
})

module.exports = mongoose.model('sellers', SellerSchema);