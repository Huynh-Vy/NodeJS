/* eslint-disable new-cap */
const express = require('express');
const {
   getUserTrucks,
   addTruck,
   getTruckById,
   updateTruckById,
   deleteTruckById,
   assignTruckById,
} = require('../controllers/truckController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getUserTrucks);
router.post('/', authMiddleware, addTruck);
router.get('/:id', authMiddleware, getTruckById);
router.put('/:id', authMiddleware, updateTruckById);
router.delete('/:id', authMiddleware, deleteTruckById);
router.post('/:id/assign', authMiddleware, assignTruckById);

module.exports = router;
