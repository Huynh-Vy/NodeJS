const User = require('../models/userModel');
const { changePasswordValidation } = require('../middlewares/validationMiddleware');
const bcrypt = require('bcrypt');

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        return res.status(200).json({
            user: {
                _id: user._id,
                role: user.role,
                email: user.email,
                createdDate: user.created_date,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const changeUserPassword = async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // Validation of password
    const { error } = changePasswordValidation(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message });
    }

    try {
        const user = await User.findOne({ _id: userId });

        if (user) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashPassword;
                user.save();

                return res.status(200).json({
                    message: 'Password changed successfully',
                });
            }
            return res.status(400).json({
                message: 'Old password is not correct',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findOneAndRemove({ _id: req.user._id });
        return res.status(200).json({
            message: 'User is deleted sucessfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUserInfo,
    changeUserPassword,
    deleteUser,
};
