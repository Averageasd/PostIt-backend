const express = require('express');
const router = express.Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.status(200).json({msg: 'Login page'});
});

router.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({username: req.body.username, password: req.body.password}).exec();
        if (!user) {
            res.status(401).json({status: 401, msg: 'invalid username or password!'});
        } else {
            jwt.sign({user: user}, 'secretKey', (err, token) => {

                // send token
                // this is passed between client and server
                res.status(200).json({
                    status:200, token: token, user: user
                });
            });
        }
    } catch (e) {
        res.status(401).json({status:401, msg: 'Cannot log in. Please try again!'});
    }

});

module.exports = router;
