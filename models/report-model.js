const db = require('../db/database');

const reportModel = {
    getTitles: function (req, res) {
        let query;

        query = `SELECT id, title FROM reports`;
        db.all(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            /*if (rows.length === 0) {
                return res.status(204).send();
            }*/
            return res.status(200).json({
                data: rows
            });
        });
    },

    getReport: function (req, res) {
        const id = req.params.id;
        let query;

        query = `SELECT * FROM reports WHERE id = ?`;
        db.get(query, id, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            /*if (!row) {
                return res.status(204).send();
            }*/
            return res.status(200).json({
                data: row
            });
        });
    },

    createReport: function (req, res) {
        const id = req.body.id;
        const title = req.body.title;
        const text = req.body.text;
        let query;

        query = `INSERT INTO reports (id, title, text) VALUES (?, ?, ?)`;
        db.run(query, id, title, text, (err) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            return res.status(201).json({
                data: {
                    status: 201,
                    message: "Report successfully created"
                }
            });
        });
    },

    updateReport: function (req, res) {
        const id = req.body.id;
        const title = req.body.title;
        const text = req.body.text;
        let query;

        query = `UPDATE reports SET title = ?, text = ? WHERE id = ?`;
        db.run(query, title, text, id, (err) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            return res.status(200).json({
                data: {
                    status: 200,
                    message: "Report successfully updated"
                }
            });
        });
    },

    deleteReport: function (req, res) {
        const id = req.params.id;
        let query;

        query = `DELETE FROM reports WHERE id = ?`;
        db.run(query, id, (err) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            return res.status(204).send();
        });
    }
};

module.exports = reportModel;
