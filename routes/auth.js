const express = require('express');

const auth = require('../models/auth-model');

const router = express.Router();

router.post('/register', (req, res) => auth.register(req, res));
router.post('/login', (req, res) => auth.login(req, res));
router.get('/verify-login',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => {
        return res.status(200).json({
            data: {
                status: 200,
                message: "User logged in",
                user: req.email,
                admin: req.admin
            }
        });
    }
);
router.get('/verify-admin-login',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => {
        return res.status(200).json({
            data: {
                status: 200,
                message: "User logged in",
                user: req.email,
                admin: req.admin
            }
        });
    }
);
router.post('/verify-admin',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res) => auth.verifyAdmin(req, res)
);

module.exports = router;
