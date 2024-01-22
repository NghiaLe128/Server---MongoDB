const Category = require("../models/Categories")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")

/**
 * Add new category to database
 * @param {*} newCategory 
 * @returns the new category
 */
const createCategory = (newCategory)=>{
    return new Promise(async(resolve, reject)=>{
        const { cateId, cateName } = newCategory
        try{
            const checkCategory = await Category.findOne({
                cateId: cateId
            })
            if(checkCategory!==null){
                reject('The name of Category is already');
            }
            if(checkCategory===null){
                const createCategory = await Category.create({
                    cateId, 
                    cateName,
                })
                if(createCategory){
                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        data: createCategory
                    })
                }
            }
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Update information of an existing category
 * @param {*} id 
 * @param {*} data 
 * @returns the updated category
 */
const updateCategory = (id, data)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkCategory = await Category.findOne({
                cateId: id
            })
            if(checkCategory === null){
                reject('The Category is not defined');
            }
           const updatedCategory = await Category.findOneAndUpdate({ cateId: id }, { $set: data }, { new: true })
            resolve({
                status: 'OK',
                message: 'Update Category success',
                data: updatedCategory
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Get all categories
 * @returns list of categories
 */
const getAllCategory = ()=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const allCategories = await Category.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allCategories

            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Get all information of a category
 * @param {*} id : id of the category
 * @returns 
 */
const getDetailsCategory = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const category = await Category.findOne({
                cateId: id
            })
            if(category === null){
                reject('The Category is not defined');
            }
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: category
            })
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Delete a category by id
 * @param {*} id 
 * @returns 
 */
const deleteCategory = (id)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const checkCategory = await Category.findOne({
                cateId: id
            })
            if(checkCategory === null){
                reject('The Category is not defined');
            }
            await Category.findOneAndDelete({ cateId: id })
            resolve({
                status: 'OK',
                message: 'Delete Category success',
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports = {
    createCategory,
    updateCategory,
    getAllCategory,
    getDetailsCategory,
    deleteCategory
}