const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const Test = require('../models/testModel');
const { body, validationResult, query, param } = require('express-validator');
const fs = require('fs');
const path = require('path');


//POST /api/test
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, contact, file } = req.body

    const checkUser = await Test.findOne({ email });

    if (checkUser) {
        res.status(400);
        throw new Error('User already exists')
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await Test.create({
        name,
        email,
        password: hashedPass,
        contact,
    })

    if (user) {
        const userData = JSON.stringify({
            _id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
        });

        const fileName = `${req.body.file}.json`;

        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (!err) {
                res.status(400);
                throw new Error('User data file already exists');
            }

            fs.writeFile(fileName, userData, (writeErr) => {
                if (writeErr) {
                    res.status(500);
                    throw new Error('Failed to save user data');
                }
            });
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid input data');
    }
})


//POST /api/test/get
const getUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    await Promise.all([
        body('email').notEmpty().trim().isEmail().withMessage('Invalid email').run(req),
        body('password').notEmpty().isLength({ min: 8, max: 12 }).withMessage('Invalid password').run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const user = await Test.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            contact: user.contact,
        })
    }
    else {
        res.status(400);
        throw new Error('User not found')
    }
})

//POST /api/test/update
const updateContact = asyncHandler(async (req, res) => {
    const { name, contact, email, password, file } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const update = { name, contact, email, password: hashedPass };
    const user = await Test.findByIdAndUpdate(req.params.id, update, {
        new: true,
    });
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    const userData = JSON.stringify({
        _id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact,
    });

    const fileName = `${req.body.file}.json`;

        fs.appendFile(fileName, userData, (writeErr) => {
            if (writeErr) {
                res.status(500);
                throw new Error('Failed to save user data');
            }
            else{
                console.log('updated')
            }
        });
    res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        contact: user.contact
    });
});

//POST /api/test/delete
const deleteUser = asyncHandler(async (req, res) => {
    const file = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const user = await Test.findById(req.params.id);

    if (user) {
        await user.remove();
        const fileName = `${req.body.file}.json`;
        fs.unlink(fileName, function (err) {
            if (err) throw err;
            console.log('File deleted!');
          });
        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(400);
        throw new Error('User not deleted');
    }
});


module.exports = {
    createUser,
    deleteUser,
    updateContact,
    getUser,
}