const knex = require('../Model/DB/db.config');
const joi = require('joi');
const {authenticationToken} = require('../Model/Security/security');


exports.login = async(req, res) => {
    const data = await req.body;
    try {
        const result = await knex('loginRegister').where({email: data.email, password: data.password})
        if (result.length>0){
            const token = authenticationToken(result)
            res.cookie(`Token = ${token}`).send('You are logged in successfully.')
        }else{
            res.send('This account does not exist, go for registration!!')
            console.log('Account does not exist.');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
        
    }
}


exports.register = async(req, res) => {
    const data = await req.body;
    try {
        const schemaValidate = joi.object({
            name: joi.string().min(3).max(20),
            email: joi.string().email().min(10).max(30).required(),
            password: joi.string().min(8).max(16).required()
        })
        let schemaValidated = schemaValidate.validate(data);
        if (schemaValidated.error) {
            return res.status(500).json({
                message: schemaValidated.error.message
            })
        }else{
            schemaValidated = schemaValidated.value;
        }

        const result = await knex('loginRegister').where({email: schemaValidated.email, password: schemaValidated.password})
        if (result.length>0){
            res.send('This account already exist!!')
        }else{
            await knex('loginRegister').insert(schemaValidated)
            res.send('You are successfully registered.')
            console.log('Account does not exist.');
        }
    } catch (err) {
        console.log(err);
        res.send(err);
        
    }
}

exports.logOut= (req,res)=>{
    try {
        res.clearCookie('Token = ').send('You are Logged Out now.')
    } catch (err) {
        console.log(err);
        res.send(err);
        
    }
}