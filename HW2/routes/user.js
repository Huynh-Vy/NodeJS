/* eslint-disable new-cap */
const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../models/User');
const { changePasswordValidation } = require('../validation');
const bcrypt = require('bcrypt');

router.get('/', verify, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        return res.status(200).send({
            'user': {
                '_id': user._id,
                'username': user.name,
                'createdDate': user.date,
            },
        });
    } catch (error) {
        return res.send(500).send({
            'message': error.message,
        });
    }
});

router.patch('/', verify, async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // Validation of password
    const { error } = changePasswordValidation(req.body);

    if (error) {
        return res.status(400).send({
            'message': error.details[0].message });
    }

    try {
        const user = await User.findOne({ _id: userId });

        if (user) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (isMatch) {
                const salt = await bcrypt.genSalt(10);
                const hasPassword = await bcrypt.hash(newPassword, salt);
                user.password = hasPassword;
                user.save();

                return res.status(200).send({
                    'message': 'Update password successfully',
                });
            }
            return res.status(400).send({
                'message': 'Old password is not correct',
            });
        }
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.delete('/', verify, async (req, res) => {
    try {
        await User.findOneAndRemove({ _id: req.user._id });
        return res.status(200).send({
            'message': 'User is deleted sucessfully',
        });
    } catch (error) {
        return res.send(500).send({
            'message': error.message,
        });
    }
});

module.exports = router;
