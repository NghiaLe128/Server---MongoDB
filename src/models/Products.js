const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        title: {type: String, require: true},
        release_date: {type: String, require: true},
        categories: {type: String, require: true},
        // sub_categories: {type: String, require: true},
        price: {type: Number, require: true},
        banner_url: {type: String, require:true},
        desc: {type: String, require: true},
        rating: {type: Number, require: true},
        reviews_count: {type: Number, require: true},
        developer: {type: String, require:true},
        short_desc: {type: String, require: true},
        img_urls: {type: Array, require:true},
        vid_urls: {type: Array, require:true},

        publisher: {type: String, require: true},

    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Products", productSchema);
module.exports = Product;