const Product = require("../models/Products")
const Categories = require("../models/Categories");
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const { generalAccessToken, generalRefreshToken } = require("./JwtService");
const { resolve } = require("path");

/**
 * Add a product to the database
 * @param {*} newProduct : a dict containing information of the product
 * @returns the created product
 */
const createProduct = async (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { title, release_date, categories, price, banner_url, desc, rating, reviews_count, developer, short_desc, img_urls, vid_urls, publisher } = newProduct;

        try {
            const hashPublisher = hashString(publisher);

            const Category = categories.split(';')[0].trim();
            const checkCate = await Categories.findOne({
                cateName: Category
            });

            if (checkCate === null) {
                reject('The Category is not defined');
            }

            const checkProduct = await Product.findOne({
                title: title
            });

            if (checkProduct !== null) {
                reject('The name of the product already exists');
            }


            const checkPublisher = await User.findOne({
                _id: publisher
            });

            if (checkPublisher === null) {
                reject('The user is not defined');
            }

            if (checkProduct === null && checkPublisher !== null && checkCate !== null) {

                const createProduct = await Product.create({
                    title,
                    release_date,
                    categories: Category,
                    price,
                    banner_url,
                    desc,
                    rating,
                    reviews_count,
                    developer,
                    short_desc,
                    img_urls: img_urls.split(';').map(url => url.trim()),
                    vid_urls: vid_urls.split(';').map(url => url.trim()),
                    publisher: hashPublisher
                });

                if (createProduct) {
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createProduct
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Update an existing product
 * @param {*} id : id of the product
 * @param {*} data : the new info to be updated
 * @returns the updated product
 */
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if(checkProduct === null){
                reject('The product is not defined');
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Update product success',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateAllProductUrls = async () => {
    try {
        const allProducts = await Product.find();

        const updatedProducts = await Promise.all(allProducts.map(async (product) => {

            if (Array.isArray(product.img_urls) && product.img_urls.length === 1 && typeof product.img_urls[0] === 'string') {
                const updatedImgUrls = product.img_urls[0].split(';').map(url => url.trim());

                await Product.findByIdAndUpdate(product._id, {
                    img_urls: updatedImgUrls
                }, { new: true });
            }

            if (Array.isArray(product.vid_urls) && product.vid_urls.length === 1 && typeof product.vid_urls[0] === 'string') {
                const updatedVidUrls = product.vid_urls[0].split(';').map(url => url.trim());

                await Product.findByIdAndUpdate(product._id, {
                    vid_urls: updatedVidUrls
                }, { new: true });
            }

            return product;
        }));

        return {
            status: 'OK',
            message: 'SUCCESS',
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get all information of a product
 * @param {*} id : id of the product
 * @returns 
 */
const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                reject('The product is not defined');
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Get all products in database
 * @returns list of products
 */
const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProduct

            })
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Get products according to publisher
 * @param {*} publisherId : id of the publisher
 * @returns list of products
 */
const getProductsByPublisher = async (publisherId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Hash the publisher ID consistently during retrieval
            const hashedPublisherId = hashString(publisherId);

            // Retrieve products by the hashed publisher ID
            const products = await Product.find({ publisher: hashedPublisherId });

            if (!products || products.length === 0) {
                reject('No products found for the specified publisher');
            } else {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: products
                });
            }
        } catch (e) {
            console.error('Error in getProductsByPublisher:', e);
            reject(`Error in getProductsByPublisher: ${e.message}`);
        }
    });
};

/**
 * Hash function for demonstration purposes
 * @param {*} str : string to hash
 * @returns hashed result
 */
function hashString(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Get products based on category
 * @param {*} type : category of the product
 * @returns list of products
 */
const getTypeProduct = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find({
                categories: type
            });

            if (products.length === 0) {
                reject('No products found for the specified category type');
            }

            const formattedProducts = products.map(product => ({
                id: product._id,
                title: product.title,
                banner_url: product.banner_url,
                price: product.price,
                short_desc: product.short_desc
            }));

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: formattedProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Get the top 12 most rated products
 * @returns List of products
 */
const getTopRatedProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const topRated = await Product.find()
                .sort({ rating: -1 })
                .limit(12)

            if (topRated.length === 0) {
                reject('No products found');
            }

            const formatted = topRated.map(product => ({
                id: product._id,
                title: product.title,
                banner_url: product.banner_url
            }));

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: formatted
            });
        } catch (e) {
            reject(e);
        }
    });
};
/**
 * Delete a product by its id
 * @param {*} id : the product id
 * @returns None
 */
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                reject('The product is not defined');
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}
/**
 * Search a collection of games from the database based on the query
 * @param {*} query : The text query to perform search on
 * @returns List of 10 games from the query results
 */
const searchBar = (query) => {
    return new Promise( async (resolve, reject) => {
        try {
            queryResults = await Product.find({ title: {$regex: query, $options:"i"}}, {title:1}).limit(10)
            resolve({
                status: 'OK',
                message: 'Returned query results',
                data: queryResults
            })
        }catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    updateAllProductUrls,
    getAllProduct,
    getProductsByPublisher,
    getTypeProduct,
    getTopRatedProducts,
    getDetailsProduct,
    deleteProduct,
    searchBar
}
