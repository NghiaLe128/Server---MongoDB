const CategoryService = require('../services/CategoriesService')

const createCategory = async (req, res) => {
    try {
        const { cateId, cateName} = req.body

        if(!cateId || !cateName){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await CategoryService.createCategory(req.body)
        return res.status(200).json(response)


    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateCategory = async(req,res)=>{
    try{
        const categoryId = req.params.id
        const data = req.body
        if(!categoryId){
            return res.status(200).json({
                status: 'ERR', 
                message: 'The categoryId is required'
            })
        }

        const response = await CategoryService.updateCategory(categoryId, data)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getAllCategory = async(req,res)=>{
    try{
        const response = await CategoryService.getAllCategory()
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsCategory = async(req,res)=>{
    try{
        const categoryId = req.params.id
        //const token = req.headers
        if(!categoryId){
            return res.status(200).json({
                status: 'ERR', 
                message: 'The categoryId is required'
            })
        }

        const response = await CategoryService.getDetailsCategory(categoryId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}

const deleteCategory = async(req,res)=>{
    try{
        const categoryId = req.params.id
        //const token = req.headers
        if(!categoryId){
            return res.status(200).json({
                status: 'ERR', 
                message: 'The categoryId is required'
            })
        }

        const response = await CategoryService.deleteCategory(categoryId)
        return res.status(200).json(response)
    }catch(e){
        return res.status(404).json({
            message: e
        })
    }
}


module.exports = {
    createCategory,
    updateCategory,
    getAllCategory,
    getDetailsCategory,
    deleteCategory
}
