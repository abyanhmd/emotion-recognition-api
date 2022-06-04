const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user-model');

router.get('/', async (req, res) => {
    const userList = await User.find().select('-password');

    if(!userList) {
        res.status(404).json({
            error: true,
            message: "There is no user registered."
        });
    }
    
    res.send(userList);
});

router.get('/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const userId = jwt.decode(token)['id']
    const email = jwt.decode(token)['email']
    const user = await User.findById(userId)

    if(!user) {
        res.status(404).json({
            error: true,
            message: "User is not found."
        });
    }

    if(userId != req.params.id) {
        res.status(500).json({
            error: true,
            message: "Unauthorized permission."
        })
    }

    res.send(user);
});

router.put('/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const userId = jwt.decode(token)['id']
    
    const user = await User.findById(userId)

    if(!user) {
        res.status(404).json({
            error: true,
            message: "User is not found."
        });
    }

    if(userId != req.params.id) {
        res.status(500).json({
            error: true,
            message: "Unauthorized permission."
        })
    }

    if(user['name'] === req.body.name) {
        res.status(500).json({
            error: true,
            message: "Selected name is unavailable."
        })
    }

    res.send(await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }));
})

module.exports = router;