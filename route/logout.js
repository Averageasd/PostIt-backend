const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.token = null;
    res.status(200).json({msg: 'log out successfully'});

});

module.exports = router;
