const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const { User } = require('../models/user-model');

router.post('/', async (req, res) => {
    const emailRegistered = await User.findOne({ email: req.body.email })

    if(emailRegistered) {
        return res.status(500).json({
            error: true,
            message: "The email is already registered in the server."
        })
    }

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    newUser.save()
        .then((it) => {
            res.status(201).json(it);
        })
        .catch((err) => {
            res.status(500).json({
                error: true,
                message: err
            })
        })
});

router.get('/', async (req, res) => {
    const userList = await User.find().select('-password');

    if(!userList) {
        res.status(500).json({
            error: true
        })
    }

    res.send(userList);
});

module.exports = router;