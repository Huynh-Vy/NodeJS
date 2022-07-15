/* eslint-disable new-cap */
const express = require('express');
const {
    addLoads,
    getUserLoads,
    getActiveLoads,
    updateLoadState,
    getLoadById,
    updateLoadById,
    deleteUserLoadById,
    getShippingInfoByLoadId,
} = require('../controllers/loadController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUserLoads);
router.post('/', authMiddleware, addLoads);
router.get('/active', authMiddleware, getActiveLoads);
router.patch('/active/state/:id', authMiddleware, updateLoadState);
router.get('/:id', authMiddleware, getLoadById);
router.put('/:id', authMiddleware, updateLoadById);
router.delete('/:id', authMiddleware, deleteUserLoadById);
router.get('/:id/shipping_info', authMiddleware, getShippingInfoByLoadId);

module.exports = router;
