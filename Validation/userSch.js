const joi = require("joi")
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);


const schema = { 
    userSchemaVal :
    joi.object ({
        name : joi.string().max(25).min(3).required(),
        email : joi.string().email().required(),
        password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
        confirm_password : joi.string()
        .equal(joi.ref('password'))
        .messages({'any.only': 'password does not match' })
        .required(),

    }).unknown(true),
}

module.exports = schema