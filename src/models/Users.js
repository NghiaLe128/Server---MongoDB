const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require:true, unique: true},
        password: {type: String, require: true},
        role: {
            type: String,
            enum: ['Admin', 'Seller', 'Customer'],
            default: 'Customer',
            require: true,
        },
        phone: {type: String, require: true},

        cart: {type: Array, require: true},
        wishlist: {type: Array, require: true},
        transHistory: {type: Array, require: true},

        access_token: {type: String, require: true},
        refresh_token: {type: String, require: true},
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("Users", userSchema);
module.exports = User;