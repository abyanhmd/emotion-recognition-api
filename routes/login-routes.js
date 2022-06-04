const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user-model');

router.post('/', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user) {
        res.status(400).json({
            error: true,
            message: "User is not found."
        });
    } 
    
    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET);
        
        res.status(200).json({
            error: false,
            message: "User authenticated.",
            id: user.id,
            token: token
        });
    } else {
        res.status(400).json({
            error: true,
            message: "Password is invalid."
        });
    }

});

module.exports = router;