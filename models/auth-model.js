const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const db = new sqlite3.Database('./db/db.sqlite');

const authModel = {
    register: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;
        const birthdate = req.body.birthdate;
        const admin = 0;
        let query;

        if (!email || !password || password.length < 8) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Email or password not valid"
                }
            });
        }

        query = `SELECT email FROM users WHERE email = ?`;
        db.get(query, email, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            if (row) {
                return res.status(400).json({
                    error: {
                        status: 400,
                        message: "Email is already registered"
                    }
                });
            }

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Bcrypt error"
                        }
                    });
                }

                query = `INSERT INTO users (email, password, name, birthdate, admin)
                         VALUES (?, ?, ?, ?, ?)`;

                db.run(query, email, hash, name, birthdate, admin, (err) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }

                    const payload = { email: email, admin: admin };
                    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                    return res.status(201).json({
                        data: {
                            status: 201,
                            message: "User successfully registered",
                            token: token,
                            admin: payload.admin
                        }
                    });
                });
            });
        });
    },

    login: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;
        let query;

        query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, email, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            if (!row) {
                return res.status(401).json({
                    error: {
                        status: 401,
                        message: "Email or password is wrong"
                    }
                });
            }

            bcrypt.compare(password, row.password, (err, isPasswordCorrect) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Bcrypt error"
                        }
                    });
                }
                if (!isPasswordCorrect) {
                    return res.status(401).json({
                        error: {
                            status: 401,
                            message: "Email or password is wrong"
                        }
                    });
                }

                const payload = { email: email, admin: row.admin };
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.status(200).json({
                    data: {
                        status: 200,
                        message: "User logged in",
                        token: token,
                        admin: payload.admin
                    }
                });
            });
        });
    },

    verifyAdmin: function (req, res) {
        const adminPass = req.body.adminPass;
        const email = req.user.email;
        const adminEmail = "admin@admin";
        const admin = 1;
        let query;

        query = `SELECT * FROM users WHERE email = ?`;
        db.get(query, adminEmail, (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }
            if (!row) {
                return res.status(401).json({
                    error: {
                        status: 401,
                        message: "Admin pass missing"
                    }
                });
            }

            bcrypt.compare(adminPass, row.password, (err, isPasswordCorrect) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Bcrypt error"
                        }
                    });
                }
                if (!isPasswordCorrect) {
                    return res.status(401).json({
                        error: {
                            status: 401,
                            message: "Admin pass is wrong"
                        }
                    });
                }

                query = `UPDATE users SET admin = ? WHERE email = ?`;
                db.run(query, admin, email, (err) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }
                    const payload = { email: email, admin: admin };
                    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                    return res.status(200).json({
                        data: {
                            status: 200,
                            message: "Admin pass verified",
                            token: token,
                            admin: payload.admin
                        }
                    });
                });
            });
        });
    },

    checkToken: function (req, res, next) {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            message: "Failed authentication"
                        }
                    });
                }

                req.user = {
                    email: decoded.email,
                    admin: decoded.admin
                };

                next();
                return;
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    message: "No token provided"
                }
            });
        }
    },

    checkAdmin: function (req, res, next) {
        if (req.user.admin) {
            next();
            return;
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    message: "Permission denied"
                }
            });
        }
    }
};

module.exports = authModel;
