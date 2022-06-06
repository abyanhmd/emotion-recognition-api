const express = require('express');
const router = express.Router();
const multer = require('multer');
// const audio = require('music-metadata');
const jwt = require('jsonwebtoken');
const { Emotion } = require('../models/emotion-model');

const FILE_TYPE = { 
    'audio/mpeg': 'mp2',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'mp4',
    'audio/x-wav': 'wav',
    'audio/x-aiff': 'aifc',
    'audio/x-aiff': 'aiff',
    'application/ogg': 'ogg'
};

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        const isValid = FILE_TYPE[file.mimetype];

        let errorMessage = new Error('Invalid file type.');

        if(isValid) {
            errorMessage = null
        } 

        callback(errorMessage, 'uploads/audio')
    },
    filename: function(req, file, callback) {
        const fileName = file.originalname.split(' ').join('-');
        callback(null, Date.now() + '-' + fileName)
    }
});

const uploadOptions = multer({ storage: storage });

router.post('/', uploadOptions.single('audioFile'), (req, res) => {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get('host')}//uploads/audio/`;
    const token = req.headers.authorization.split(' ')[1]
    const email = jwt.decode(token)['email']
    const username = email.split('@')[0]
    
    const emotion = new Emotion({
        email: username,
        fileName: fileName,
        audioFile: `${basePath}${fileName}`
    });
    emotion.save()
        .then((it) => {
            res.status(201).json(it)
        })
        .catch((err) => {
            res.status(500).json({
                error: true,
                message: err
            })
        })
});

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const email = jwt.decode(token)['email']
    const username = email.split('@')[0]
    const query = { email: username };
    const emotionHistory = await Emotion.find(query);

    if(!emotionHistory) {
        res.status(500).json({
            error: true
        })
    }

    if(emotionHistory != null) {
        res.send(emotionHistory)
    } else {
        res.status(404).json({
            error: true,
            message: "No emotion history found."
        })
    }
});

router.get('/:id', async (req, res) => {
    const emotion = await Emotion.findById(req.params.id)

    if(!emotion) {
        res.status(500).json({
            error: true,
            message: "No item found."
        })
    }

    res.status(200).send(emotion)
});

router.delete('/:id', async (req, res) => {
    Emotion.findByIdAndRemove(req.params.id)
        .then((it) => {
            if(it){
                return res.status(200).json({
                    error: false,
                    message: "Successfully deleted an emotion item."
                })
            } else {
                return res.status(404).json({
                    error: true,
                    message: "Emotion item not found."
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({
                error: false,
                message: err
            })
        })
});

module.exports = router;