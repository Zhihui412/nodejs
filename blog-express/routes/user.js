var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    // 可以直接从req.body中获取
    const { username, password } = req.body
    res.json({
        password,
        username
    })
});

module.exports = router;
