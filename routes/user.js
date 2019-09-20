const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});

router.post('/', (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

router.put('/', (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

router.delete('/', (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

module.exports = router;
