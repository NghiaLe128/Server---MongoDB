const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema(
    {
        cateId: {type: String, require: true},
        cateName: {type: String, require: true},

    },
    {
        timestamps: true,
    }
);

const Categories = mongoose.model("Categories", categoriesSchema);
module.exports = Categories;