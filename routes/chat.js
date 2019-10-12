const express = require('express');

const auth = require('../models/auth-model');
const chat = require('../models/chat-model');

const router = express.Router();

router.get('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => chat.loadMessages(req, res)
);
router.post('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => chat.saveMessages(req, res)
);

module.exports = router;
