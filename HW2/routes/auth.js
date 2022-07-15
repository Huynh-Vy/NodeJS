/* eslint-disable max-len */
// eslint-disable-next-line new-cap
const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send({ 'message': error.details[0].message });
    }

    // Checking if user is already in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send({ 'message': 'Email is already exist' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hasPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hasPassword,
    });

    try {
        await user.save();
        return res.status(200).send({
            'message': 'Success',
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ 'message': error.details[0].message });
    }

    // Checking if user is already in database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ 'message': 'Email or password is wrong' });
    }
    // PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare( req.body.password, user.password );
    if (!validPassword) {
        return res.status(400).send({ 'message': 'Invalid password' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('jwt', token);
    return res.status(200).send({
        'message': 'Success',
        'jwt': token,
    });
});

module.exports = router;
