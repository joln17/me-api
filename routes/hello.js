const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

router.get("/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

module.exports = router;
