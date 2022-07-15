/* eslint-disable no-trailing-spaces */
/* eslint-disable new-cap */
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { registerValidation, loginValidation, resetPasswordValidation } = require('../middlewares/validationMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');


const register = async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    // Checking if user is already in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).json({
            message: 'Email is already exist',
        });
    }

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({
            message: 'Email or password or role is empty',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({
        _id: new mongoose.Types.ObjectId,
        email: email,
        role: role,
        password: hashPassword,
        created_date: Date.now(),
    });

    try {
        await user.save();
        return res.status(200).json({
            message: 'Profile created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // Checking if user is already in database
    if (!user) {
        return res.status(400).json({
            message: 'Email or password not match',
        });
    }
    
    // PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare( password, user.password );
    if (!validPassword) {
        return res.status(400).json({
            message: 'Email or password not match',
        });
    }

    // Create and assign token
    const token = jwt.sign(
        { _id: user._id, 
            email: user.email,
        }, 
        process.env.SECRET_KEY,
    );
    res.header('jwt', token);
    return res.status(200).json({
        message: 'Success',
        jwt: token,
    });
};

const resetPassword = async (req, res) => {
    const { error } = resetPasswordValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: 'Your email is not correct',
            });
        }
        
        const token = jwt.sign({
            _id: user.id, email: user.email }, 
            process.env.RESET_PASSWORD_KEY, 
            { expiresIn: '15m',
        });

        await user.updateOne({ resetLink: token });
        const link = `${process.env.BASE_URL}/password-reset/${user.id}/${token}`;
        await sendEmail(user.email, 'Password reset', link);
        return res.status(200).json({
            message: 'New password is sent to your email',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    resetPassword,
};

