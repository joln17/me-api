const express = require('express');

const auth = require('../models/auth-model');
const report = require('../models/report-model');

const router = express.Router();

router.get('/titles', (req, res) => report.getTitles(req, res));
router.get('/week/:id', (req, res) => report.getReport(req, res));
router.post('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => report.createReport(req, res)
);
router.put('/',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => report.updateReport(req, res)
);
router.delete('/week/:id',
    (req, res, next) => auth.checkToken(req, res, next),
    (req, res, next) => auth.checkAdmin(req, res, next),
    (req, res) => report.deleteReport(req, res)
);

module.exports = router;
