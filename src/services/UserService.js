const User = require("../models/Users")
const Product = require("../models/Products")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")
const { getTopRatedProducts } = require("./ProductService")

/**
 * Authenticate and add new user account to the database
 * @param {*} newUser : information of the new user
 * @returns 
 */
const createUser = (newUser)=>{
    return new Promise(async(resolve, reject)=>{
        const {name,email, password, phone, role, cart, wishlist, transHistory } = newUser

        try{
            const checkUser = await User.findOne({
                email: email
            })

            if(checkUser!==null){
                reject('The email is already');
            }

            const hash = bcrypt.hashSync(password, 10)

            if(checkUser===null){
                const createUser = await User.create({
                    name,
                    email, 
                    password: hash, 
                    phone,
                    role,
                    cart: [],
                    wishlist: [],
                    transHistory: []
                })
                if(createUser){
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createUser
                    })
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Authenticate a user's credentials to log in
 * @param {*} userLogin : login credentials
 * @returns the user id and its tokens
 */
const loginUser = (userLogin)=>{
    return new Promise(async(resolve, reject)=>{
        const {email, password, confirmPassword} = userLogin
        try{
            const checkUser = await User.findOne({
                email: email
            })

            if(checkUser === null){
                reject('The user is not defined');
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if(!comparePassword){
                reject('The password or username is incorrect');
            }
            const user_id = checkUser._id
            const access_token = await generalAccessToken({
                id: checkUser.id,
                role: checkUser.role
            })
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                role: checkUser.role
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                user_id,
                access_token, 
                refresh_token
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Update information of a user
 * @param {*} id : id of the user
 * @param {*} data : information to be updated
 * @returns 
 */
const updateUser = (id, data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                reject('The user is not defined');
            }
           const updatedUser = await User.findByIdAndUpdate(id, data, {new: true})
            resolve({
                status: 'OK',
                message: 'Update user success',
                data: updatedUser
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Delete a user by id
 * @param {*} id 
 * @returns 
 */
const deleteUser = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkUser = await User.findOne({
                _id: id
            })
            if(checkUser === null){
                reject('The user is not defined');
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Get all users in the database
 * @returns list of users
 */
const getAllUser = ()=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser

            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Get all information of a user
 * @param {*} id : id of the user
 * @returns 
 */
const getDetailsUser = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const user = await User.findOne({
                _id: id
            })
            if(user === null){
                reject('The user is not defined');
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        }catch(e){
            reject(e)
        }
    })
}

const getInfo = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Update the user's cart
 * @param {*} userId : id of the user
 * @param {*} updatedArr : the new cart to update
 * @returns 
 */
const updateCart = (userId, updatedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);

            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }

            // Get the current cart from the user or initialize an empty array
            const currentCart = user.cart || [];

            // Check if updatedArr is an array
            if (!Array.isArray(updatedArr)) {
                reject('Invalid data format. updatedArr must be an array.');
            }

            for (const updatedProduct of updatedArr) {
                // Find the product in the current cart by title
                const existingProduct = currentCart.find(item => item.title === updatedProduct.title);

                if (existingProduct) {
                    reject('The Product is already in the cart');
                } else {
                    // Check if the product exists in the database
                    const checkProduct = await Product.findOne({
                        title: updatedProduct.title,
                    });

                    if (!checkProduct) {
                        reject('The Product is not defined');
                    }else{
                        // If the product doesn't exist in the cart, add it
                        currentCart.push({ ...updatedProduct });
                    }
                }
            }
            // Update the cart in the user Card
            user.cart = currentCart;

            // Save the updated user to the database
            const updatedUser = await user.save();

            resolve({
                status: 'OK',
                message: 'Update cart success',
                data: updatedUser
            })
        } catch(e){
            reject(e)
        }
    })
};

/**
 * Delete a product in the user's cart
 * @param {*} userId : id of the user
 * @param {*} deletedArr : the products to delete
 * @returns 
 */
const deleteCart = (userId, deletedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);
    
            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }
    
            // Get the current cart from the user or initialize an empty array
            const currentCart = user.cart || [];
    
            // Check if updatedArr is an array
            if (!Array.isArray(deletedArr)) {
                reject('Invalid data format. deletedArr must be an array.');
            }
    
            for(const deletedProduct of deletedArr){
                const productIndex = currentCart.findIndex(item => item.title === deletedProduct.title);
    
                if (productIndex !== -1) {
                    // If the product exists in the cart, remove it
                    currentCart.splice(productIndex, 1);
                } else {
                    reject('The Product is not in the cart');
                }
            }
    
            // Update the cart in the user Card
            user.cart = currentCart;
    
            // Save the updated user to the database
            const deletedUser = await user.save();
    
            resolve({
                status: 'OK',
                message: 'Product removed successfully',
                data: deletedUser
            })
        } catch(e){
            reject(e)
        }
    })
};

/**
 * Delete the entire cart of a user
 * @param {*} userId 
 * @returns 
 */
const deleteAllCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Find the user by ID
            const user = await User.findById(userId);

            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }

            // Clear the cart in the user's data
            user.cart = [];

            // Save the updated user to the database
            const deletedUser = await user.save();

            resolve({
                status: 'OK',
                message: 'All products removed from the cart successfully',
                data: deletedUser
            });
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Update the wishlist
 * @param {*} userId 
 * @param {*} updatedArr 
 * @returns 
 */
const updateWishList = (userId, updatedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);
    
            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }
    
            // Get the current wishlist from the user or initialize an empty array
            const currentWishList = user.wishlist || [];
    
            // Check if updatedArr is an array
            if (!Array.isArray(updatedArr)) {
                reject('Invalid data format. updatedArr must be an array.');
            }
    
            for (const updatedProduct of updatedArr) {
                // Find the product in the current wishlist by title
                const existingProduct = currentWishList.find(item => item.title === updatedProduct.title);
    
                if (existingProduct) {
                    reject('The Product is already in the WishList');
                } else {
                    // Check if the product exists in the database
                    const checkProduct = await Product.findOne({
                        title: updatedProduct.title,
                    });
    
                    if (!checkProduct) {
                        reject('The Product is not defined');
                    }else{
                        // If the product doesn't exist in the wishlist, add it
                        currentWishList.push({ ...updatedProduct });
                    }
                }
            }
            // Update the wishlist in the user Card
            user.wishlist = currentWishList;
    
            // Save the updated user to the database
            const updatedUser = await user.save();
    
            resolve({
                status: 'OK',
                message: 'Update WishList success',
                data: updatedUser
            })
        } catch(e){
            reject(e)
        }
    })
};

/**
 * Delete items in the wishlist
 * @param {*} userId 
 * @param {*} deletedArr 
 * @returns 
 */
const deleteWishList = (userId, deletedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);
    
            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }
    
            // Get the current wishlist from the user or initialize an empty array
            const currentWishList = user.wishlist || [];
    
            // Check if updatedArr is an array
            if (!Array.isArray(deletedArr)) {
                reject('Invalid data format. deletedArr must be an array.');
            }
    
            for(const deletedProduct of deletedArr){
                const productIndex = currentWishList.findIndex(item => item.title === deletedProduct.title);
    
                if (productIndex !== -1) {
                    // If the product exists in the wishlist, remove it
                    currentWishList.splice(productIndex, 1);
                } else {
                    reject('The Product is not in the wishlist');
                }
            }
    
            // Update the wishlist in the user Card
            user.wishlist = currentWishList;
    
            // Save the updated user to the database
            const deletedUser = await user.save();
    
            resolve({
                status: 'OK',
                message: 'Product removed successfully',
                data: deletedUser
            })
        } catch(e){
            reject(e)
        }
    })
}

const updateTransHis = (userId, updatedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);
    
            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }
    
            // Get the current transHistory from the user or initialize an empty array
            const currentTransHis = user.transHistory || [];
    
            // Check if updatedArr is an array
            if (!Array.isArray(updatedArr)) {
                reject('Invalid data format. updatedArr must be an array.');
            }
    
            for (const updatedProduct of updatedArr) {
                // Find the product in the current transHistory by title
                const existingProduct = currentTransHis.find(item => item.title === updatedProduct.title);
    
                if (existingProduct) {
                    reject('The Product is already in the transHistory');
                } else {
                    // Check if the product exists in the database
                    const checkProduct = await Product.findOne({
                        title: updatedProduct.title,
                    });
    
                    if (!checkProduct) {
                        reject('The Product is not defined');
                    }else{
                        // If the product doesn't exist in the transHistory, add it
                        currentTransHis.push({ ...updatedProduct });
                    }
                }
            }
            // Update the transHistory in the user Card
            user.transHistory = currentTransHis;
    
            // Save the updated user to the database
            const updatedUser = await user.save();
    
            resolve({
                status: 'OK',
                message: 'Update transHistory success',
                data: updatedUser
            })
        } catch(e){
            reject(e)
        }
    })
};

const deleteTransHis = (userId, deletedArr) => {
    return new Promise(async(resolve, reject)=>{
        try {
            // Find the user by ID
            const user = await User.findById(userId);
    
            // Check if the user exists
            if (!user) {
                reject('The user is not defined');
            }
    
            // Get the current transHistory from the user or initialize an empty array
            const currentTransHis = user.transHistory || [];
    
            // Check if updatedArr is an array
            if (!Array.isArray(deletedArr)) {
                reject('Invalid data format. DeletedArr must be an array.');
            }
    
            for(const deletedProduct of deletedArr){
                const productIndex = currentTransHis.findIndex(item => item.title === deletedProduct.title);
    
                if (productIndex !== -1) {
                    // If the product exists in the transHistory, remove it
                    currentTransHis.splice(productIndex, 1);
                } else {
                    reject('The Product is not in the transHistory');
                }
            }
    
            // Update the transHistory in the user Card
            user.transHistory = currentTransHis;
    
            // Save the updated user to the database
            const deletedUser = await user.save();
    
            resolve({
                status: 'OK',
                message: 'Product removed successfully',
                data: deletedUser
            })
        } catch(e){
            reject(e)
        }
    })
};

/**
 * Perform min-max scaling on an array of numbers
 * @param {Array} arr: An array of numbers
 * @returns scaled array
 */
function minmaxScaler(arr, min=0, max=1) {
    old_max = Math.max.apply(null, arr)
    old_min = Math.min.apply(null, arr)
    new_max = max
    new_min = min

    var X_minArr = arr.map(function (values) {
        return values - old_min;
      });
      // X_std = (X - X.min()) / (X.max() - X.min())
      var X_std = X_minArr.map(function (values) {
        return values / (old_max - old_min);
      });
      // X_scaled = X_std * (max - min) + min
      var X_scaled = X_std.map(function (values) {
        return values * (new_max - new_min) + new_min;
      });
    
    return X_scaled;    
}

/**
 * Calculate scores for a list of products.
 * Score of a product depends on its price, rating, reviews count and category.
 * @param {*} arr : The list of products
 * @param {*} fav_cats : A set of categories for products to match with. Can be empty.
 * @returns a list of scores corresponding to the products
 */
function calScores(arr, fav_cats) {
    //Initialization
    scores = []
    ratings = []
    prices = []
    reviews_counts = []
    cat_score = []
    //Iterate through the product list to create arrays of attributes
    for (const product of arr) {
        ratings.push(product['rating'])
        prices.push(product['price'])
        reviews_counts.push(product['reviews_count'])
        //For category, we find if it is one of the user's favorite categories or not
        if (fav_cats.has(product['categories'])) {
            cat_score.push(1)
        }
        else {
            cat_score.push(0)
        }
    }
    //Perform min-max scaling on all numeric attributes
    ratings = minmaxScaler(ratings)
    prices = minmaxScaler(prices)
    reviews_counts = minmaxScaler(reviews_counts)
    //Calculating scores
    for (let i=0; i < arr.length; i++) {
        //Calculate score by formula
        score = 0.3*ratings[i] + 0.2*(prices[i]*-1) + 0.3*reviews_counts[i] + 0.3*cat_score[i]
        scores.push(score)
    }
    return scores
}

function findIndexesOfMaxValues(arr, n) {
    // Create an array of objects with the original index and value
    const indexedArray = arr.map((value, index) => ({ value, index }));

    // Sort the array in descending order based on values
    indexedArray.sort((a, b) => b.value - a.value);

    // Extract the first n indices from the sorted array
    const maxIndices = indexedArray.slice(0, n).map(item => item.index);

    return maxIndices;
}

/**
 * Generate products curated to the user's wishlist/cart
 * @param {*} userId : Id of the user
 * @returns List of curated products
 */
const getRecommendations = (userId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            //Find and validate user
            const user = await User.findById(userId);
            if(!user) {
                reject('The user is not defined');
            }
            topRatedProducts = await Product.find({},{categories:1, price:1, rating:1, reviews_count:1}).sort({rating:1}).limit(75).exec()
            //Get the products in user's cart and wishlist to evaluate
            //Obtain all categories that exists in user's cart and wishlist
            cartProducts = user['cart']
            wishProducts = user['wishlist']
            fav_cats = []
            for (const product of cartProducts) {
                fav_cats.push(product['categories'])
            }
            for (const product of wishProducts) {
                fav_cats.push(product['categories'])
            }
            fav_cats = new Set(fav_cats)
            //Calculate score for each product
            scores = calScores(topRatedProducts, fav_cats)
            //Get 6 top product
            chosenIndices = findIndexesOfMaxValues(scores, 6)
            chosenIds = chosenIndices.map(index => topRatedProducts[index]['_id'])
            recommendedProducts = await Product.find({_id: {$in: chosenIds}})

            resolve({
                status: 'OK',
                message: 'Recommended products returned',
                data: recommendedProducts
            })
        }
        catch(e){
            console.log(e)
            reject(e)
        }
    })
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    getInfo,

    updateCart,
    deleteCart,
    deleteAllCart,
    
    updateWishList,
    deleteWishList,

    updateTransHis,
    deleteTransHis,

    getRecommendations
}