const express = require('express');
const router = express.Router()
const productController = require('../controllers/ProductController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/createProduct',authMiddleware(['Admin', 'Seller']), productController.createProduct)
router.put('/updatePro/:id', authMiddleware(['Admin', 'Seller']), productController.updateProduct)
router.put('/updateProUrl', productController.updateAllProductUrls)
router.get('/getAll-Pro',  productController.getAllProduct)
router.get('/getDetails-Pro/:id', productController.getDetailsProduct)
router.get('/getProByPub/:id',  productController.getProductsByPublisher)
router.get('/getType-Pro/:type', productController.getTypeProduct)
router.get('/getTopRated-Pro', productController.getTopRatedProducts)
router.delete('/deleteProduct/:id',authMiddleware(['Admin', 'Seller']),  productController.deleteProduct)
//POST - query in body
router.post('/searchBar', productController.searchBar)
module.exports = router
