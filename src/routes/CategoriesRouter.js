const express = require('express');
const router = express.Router()
const categoriesController = require('../controllers/CategoriesController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/createCategory', categoriesController.createCategory)
router.put('/updateCate/:id', categoriesController.updateCategory)// cateId
router.get('/getAll-category', categoriesController.getAllCategory)
router.get('/getDetails-Cate/:id', categoriesController.getDetailsCategory)// cateId
router.delete('/deleteCate/:id',categoriesController.deleteCategory)// cateId



module.exports = router