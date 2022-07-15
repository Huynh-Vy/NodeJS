/* eslint-disable no-tabs */
const Truck = require('../models/truckModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { STATUS } = require('../utils/constants');

const getUserTrucks = async (req, res) => {
	try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }
		const trucks = await Truck.find({ created_by: user._id });
		if (!trucks) {
			return res.status(400).json({
                message: 'Truck has not been found',
            });
		}
		return res.status(200).json({ trucks });
	} catch (error) {
		return res.status(500).json({
            message: error.message,
        });
	}
};

const addTruck = async (req, res) => {
	try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }
		const truck = await new Truck({
            _id: new mongoose.Types.ObjectId(),
			created_by: user._id,
			assigned_to: null,
			type: req.body.type,
			status: STATUS.IS,
			created_date: Date.now(),
		});
		await truck.save();
		return res.status(200).json({ message: 'Truck created successfully' });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const getTruckById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                'message': 'Please provide truck ID',
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }

        const truck = await Truck.findById({ _id: id });
        if (!truck) {
            return res.status(400).json({
                message: 'No truck has been found',
            });
        }
        return res.status(200).json({ truck });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateTruckById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                'message': 'Please provide truck ID',
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }
        const truck = await Truck.findOne({ _id: id });
        if (!truck) {
            return res.status(400).json({
                message: 'No truck has been found',
            });
        }
        if (truck.type === req.body.type) {
            return res.status(400).json({
                message: 'Please select another truck type',
            });
        }
        truck.type = req.body.type;
        await truck.save();
        return res.status(200).json({
            message: 'Truck details changed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deleteTruckById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                'message': 'Please provide truck ID',
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }
        await Truck.findOneAndDelete({ _id: id });
        return res.status(200).json({
            message: 'Truck deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const assignTruckById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                'message': 'Please provide truck ID',
            });
        }
        if (!user) {
            return res.status(400).json({
                message: 'Invalid request',
            });
        }
        if (user.role !== 'DRIVER') {
            return res.status(403).json({
                message: 'Forbidden access',
            });
        }
        const truck = await Truck.findOne({ _id: id });
        if (!truck) {
            return res.status(400).json({
                message: 'No truck has been found',
            });
        }
        truck.assigned_to = req.user._id;
        truck.save();
        return res.status(200).json({
            message: 'Truck assigned successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUserTrucks,
    addTruck,
    getTruckById,
    updateTruckById,
    deleteTruckById,
    assignTruckById,
};
