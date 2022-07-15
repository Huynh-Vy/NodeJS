/* eslint-disable max-len */
// VALIDATION
const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
        .min(6)
        .required(),
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .min(6)
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
    });

    return schema.validate(data);
};

const changePasswordValidation = (data) => {
    const schema = Joi.object({
        oldPassword: Joi.string()
        .min(6)
        .required(),
        newPassword: Joi.string()
        .min(6)
        .required(),
        confirmNewPassword: Joi.any().
        valid(Joi.ref('newPassword'))
        .required()
        .options({ messages: { 'any.only': 'Confimed password does not match' } }),
    });

    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changePasswordValidation = changePasswordValidation;


