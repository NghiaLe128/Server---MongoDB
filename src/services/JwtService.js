const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

/**
 * Generate access token
 * @param {*} payload 
 * @returns token
 */
const generalAccessToken = async (payload)=>{
    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN , {expiresIn: '1d'})

    return access_token
}

/**
 * Refresh current access token
 * @param {*} payload 
 * @returns token
 */
const generalRefreshToken = async (payload)=>{
    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, {expiresIn: '365d'})

    return refresh_token
}

const refreshTokenJwtService = (token)=>{
    return new Promise((resolve, reject)=>{
        try{
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user)=>{
                if(err){
                    resolve({
                        status: 'ERROR',
                        message: 'The authemtication'
                    })
                }
                const { payload } = user
                const access_token = await generalAccessToken({
                    id: payload?.id,
                    role: payload?.role
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })
        }catch(e){
            reject(e)
        }
    })
}

module.exports ={
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJwtService
}