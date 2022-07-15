/* eslint-disable new-cap */
const express = require('express');
const { getUserInfo, changeUserPassword, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUserInfo);
router.patch('/password', authMiddleware, changeUserPassword);
router.delete('/', authMiddleware, deleteUser);

module.exports = router;
