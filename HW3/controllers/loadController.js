/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
const Load = require('../models/loadModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { LOAD_STATUS, LOAD_STATE } = require('../utils/constants');
const { updateLoadSchema } = require('../middlewares/validationMiddleware');

const addLoads = async (req, res) => {
    try {
        const load = await new Load({
            _id: new mongoose.Types.ObjectId(),
            created_by: req.user._id,
            assigned_to: null,
            status: Object.values(LOAD_STATUS)[0],
            state: LOAD_STATE[0],
            name: req.body.name,
            payload: req.body.payload,
            pickup_address: req.body.pickup_address,
            delivery_address: req.body.delivery_address,
            dimensions: {
                width: req.body.dimensions.width,
                length: req.body.dimensions.length,
                height: req.body.dimensions.height,
            },
            logs: [
                {
                    message: req.body.logs[0].message,
                    time: Date.now(),
                },
            ],
            created_date: Date.now(),
        });

        await load.save();
        return res.status(200).json({
            message: 'Load created successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getUserLoads = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid user',
        });
    }

    try {
        const loads = await Load.find({
            created_by: user._id,
        });
        return res.status(200).json({ loads });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getActiveLoads = async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid user',
        });
    }

    try {
        const role = req.user.role;
        if (role !== 'DRIVER') {
            return res.status(403).json({ message: 'Forbidden access' });
        }
		const loads = await Load.findOne({
			assigned_to: user._id,
			status: LOAD_STATUS.ASSIGNED,
		});
        if (loads === null) {
            return res.status(400).json({
                message: 'You do not have any load',
            });
        }
		return res.status(200).json({ loads });
	} catch (error) {
		return res.status(500).json({
            message: error.message,
        });
	}
};

const updateLoadState = async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid user',
        });
    }

	try {
        const loadId = req.params.id;
        const driverId = req.user._id;
        const load = await Load.findById(loadId);

        if (!load) {
            return res.status(400).json({
                message: 'This load does not exist',
            });
        }

        if (load.assigned_to != driverId) {
            return res.status(403).json({ message: 'Forbidden access' });
        }

        if (load.status !== 'ASSIGNED') {
            return res.status(400).json({
                message: 'Forbidden to change state',
            });
        }

		if (load.state === LOAD_STATE[LOAD_STATE.length - 1]) {
			return res
				.status(400).json({
                    message: 'Load is already in last state',
                });
		}
		load.state = LOAD_STATE[LOAD_STATE.indexOf(load.state) + 1];
		await load.save();
		return res.status(200).json({
			message: `Load state changed to ${load.state}`,
		});
	} catch (error) {
		return res.status(500).json({
            message: error.message,
        });
	}
};

const getLoadById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            'message': 'Please provide load ID',
        });
    }
	try {
		const load = await Load.findOne({ _id: id });
        if (!load) {
            return res.status(400).json({
                message: 'Load has not been found',
            });
        }
		return res.status(200).json({ load });
	} catch (error) {
		return res.status(500).json({
            message: error.message,
        });
	}
};

const updateLoadById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            'message': 'Please provide load ID',
        });
    }

    const { error } = updateLoadSchema(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

	try {
		const load = await Load.findOne({ _id: id });
		load.name = req.body.name;
		load.payload = req.body.payload;
		load.pickup_address = req.body.pickup_address;
		load.delivery_address = req.body.delivery_address;
		load.dimensions = {
            width: req.body.dimensions.width,
            length: req.body.dimensions.length,
            height: req.body.dimensions.height,
        };
		await load.save();
		return res.status(200).json({
			message: 'Load details changed successfully',
		});
	} catch (error) {
		return res.status(500).json({
            message: error.message,
        });
	};
};

const deleteUserLoadById = async (req, res)=> {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            'message': 'Please provide load ID',
        });
    }
    try {
      await Load.findOneAndDelete({
        _id: req.params.id,
      });
      return res.status(200).json('Load details deleted successfully');
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getShippingInfoByLoadId = async (req, res)=> {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            'message': 'Please provide load ID',
        });
    }
    try {
      const load = await Load.findOne({
        _id: req.params.id,
      });
      if (!load) {
        res.status(400).json({
            message: 'Load has not been found',
        });
      }
      return res.status(200).json({ load });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addLoads,
    getUserLoads,
    getActiveLoads,
    updateLoadState,
    getLoadById,
    updateLoadById,
    deleteUserLoadById,
    getShippingInfoByLoadId,
};
