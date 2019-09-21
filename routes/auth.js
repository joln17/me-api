const express = require('express');

const auth = require('../models/auth-model');

const router = express.Router();

router.post('/login', (req, res) => auth.login(req, res));

module.exports = router;
