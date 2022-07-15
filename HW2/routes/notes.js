// eslint-disable-next-line new-cap
const router = require('express').Router();

const Note = require('../models/Note');
const User = require('../models/User');
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
    const userId = req.user._id;
    const { offset = 0, limit = 10 } = req.query;

    try {
        const user = await User.findOne({ _id: userId });
        const page = await Note.paginate(
            { userId: user._id },

            {
                offset,
                limit,
                customLabels: {
                    totalPages: 'pageCount',
                    docs: 'notes',
                },
            },
        );

        return res.status(400).send({
            'offset': page.offset,
            'limit': page.limit,
            'count': page.pageCount,
            'notes': page.notes,
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.post('/', verify, async (req, res)=> {
    const { text } = req.body;

    try {
        const user = await User.findOne({ _id: req.user._id });

        if (user && text) {
            // Create new note
            const note = new Note({
                userId: user._id,
                completed: false,
                text,
            });
            await note.save();
            return res.status(200).send({
                'message': 'Note is posted successfully',
            });
        }
        return res.status(400).send({
            'message': 'Invalid user or text',
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    };
});

router.get('/:id', verify, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: req.user._id });

    if (!user || !id) {
        return res.status(400).send({
            'message': 'Invalid user or no id params',
        });
    }
    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(400).send({
                'message': 'No note was found',
            });
        }
        return res.status(200).send({
            'message': note,
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.put('/:id', verify, async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const user = await User.findOne({ _id: req.user._id });

    if (!user || !id) {
        return res.status(400).send({
            'message': 'Invalid user or no id params',
        });
    }

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(400).send({
                'message': 'No note was found',
            });
        }
        await Note.findOneAndUpdate(
            { _id: id, userId: user._id }, { $set: { text } },
        );
        return res.status(200).send({
            'message': 'Note is updated successfully',
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.patch('/:id', verify, async (req, res)=> {
    const { id } = req.params;
    const user = await User.findOne({ _id: req.user._id });

    if (!user || !id) {
        return res.status(400).send({
            'message': 'Invalid user or no id params',
        });
    }

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(400).send({
                'message': 'No note was found',
            });
        }
        note.completed = !note.completed;
        await note.save();
        return res.status(200).send({
            'message': 'Note status is updated successfully',
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

router.delete('/:id', verify, async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: req.user._id });

    if (!user || !id) {
        return res.status(400).send({
            'message': 'Invalid user or no id params',
        });
    }

    try {
        const note = await Note.findById(id);
        if (!note) {
            return res.status(400).send({
                'message': 'No note was found',
            });
        }

        await Note.findOneAndRemove({ _id: id });
        return res.status(200).send({
            'message': 'Note is delete successfully',
        });
    } catch (error) {
        return res.status(500).send({
            'message': error.message,
        });
    }
});

module.exports = router;
