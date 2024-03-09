const express = require('express');
const router = express.Router();
const User = require('../model/User');

router.get('/', (req, res) => {
    res.status(200).json({msg: 'Signup page'});
});

router.post('/signup', async (req, res) => {
    try {
        let user = await User.findOne({username: req.body.username}).exec();
        if (user) {
            res.status(401).json({status:401, msg: `user with username ${req.body.username} already exists.`})
        } else {
            user = new User({username: req.body.username, password: req.body.password});
            await user.save();
            res.status(200).json({status:200, msg: 'signed up successfully'});
        }
    } catch (e) {
        res.status(401).json({msg: 'Cannot register. Please try again!'});
    }
})

module.exports = router;
