const ProductService = require('../services/ProductService')
const User = require("../models/Users");

const createProduct = async (req, res) => {
    try {
        const { title, release_date, categories, price, banner_url, desc, rating, reviews_count, developer, short_desc, img_urls, vid_urls, publisher } = req.body;

        if (!title || !release_date || !categories || price == null || !banner_url || !desc || !rating || !reviews_count || !developer || !short_desc || !img_urls || !vid_urls ||!publisher) {
            return res.status(404).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

        const response = await ProductService.createProduct(req.body);
        return res.status(200).json(response);

    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
}

const updateProduct = async(req,res)=>{
    try{
        const productId = req.params.id
        const data = req.body
        if(!productId){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The productId is required'
            })
        }

        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const updateAllProductUrls = async (req, res) => {
    try {
        const response = await ProductService.updateAllProductUrls();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Internal Server Error'
        });
    }
};

const getAllProduct = async(req,res)=>{
    try{
        const response = await ProductService.getAllProduct()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getProductsByPublisher = async (req, res) => {
    try {
        const publisher = req.params.id;

        if (!publisher) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Publisher ID is required'
            });
        }

        const response = await ProductService.getProductsByPublisher(publisher);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e
        });
    }
};


const getDetailsProduct = async(req,res)=>{
    try{
        const productId = req.params.id
        //const token = req.headers
        if(!productId){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The productId is required'
            })
        }

        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getTypeProduct = async(req,res)=>{
    try{
        const productCate = req.params.type
        //const token = req.headers
        if(!productCate){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The category of product is required'
            })
        }

        const response = await ProductService.getTypeProduct(productCate)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getTopRatedProducts = async (req, res) => {
    try {
        const response = await ProductService.getTopRatedProducts();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const deleteProduct = async(req,res)=>{
    try{
        const productId = req.params.id
        //const token = req.headers
        if(!productId){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The productId is required'
            })
        }

        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const searchBar = async(req, res) => {
    try{
        const query = req.body.query
        //const token = req.headers
        if(!query){
            return res.status(404).json({
                status: 'ERR', 
                message: 'The query is required'
            })
        }

        const response = await ProductService.searchBar(query)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    updateAllProductUrls,
    getTypeProduct,
    getAllProduct,
    getProductsByPublisher,
    getTopRatedProducts,
    getDetailsProduct,
    deleteProduct,
    searchBar
}