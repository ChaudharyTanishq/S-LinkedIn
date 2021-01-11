const Joi = require('joi')

const signupValidate = (data) => {
    const validationSchema = Joi.object({
        name: Joi.string().required().min(4).max(32),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(128),
        isBoss: Joi.boolean().required()
    })
    
    // validate the person before making one
    return validationSchema.validate(data)
}

const signinValidate = (data) => {
    const validationSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(128)
    })
    
    // validate the person before making one
    return validationSchema.validate(data)
}

module.exports = { signupValidate, signinValidate }
