const Joi = require('joi');
const { ROLE } = require('../utils/constants');

const registerValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
        role: Joi.string()
        .valid(...Object.values(ROLE))
        .insensitive(),
    });

    return schema.validate(data);
};


const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .required()
        .email(),
        password: Joi.string()
        .min(6)
        .required(),
    });

    return schema.validate(data);
};

const resetPasswordValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .required()
        .email(),
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

const updateLoadSchema = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        payload: Joi.number().required(),
        pickup_address: Joi.string().required(),
        delivery_address: Joi.string().required(),
        dimensions: {
          width: Joi.number().required(),
          length: Joi.number().required(),
          height: Joi.number().required(),
        },
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    resetPasswordValidation,
    changePasswordValidation,
    updateLoadSchema,
};


