const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const db = new sqlite3.Database('../db/db.sqlite');

const authModel = {
    register: function (req, res) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password || password.length < 8) {
            return res.status(401).json({
                error: {
                    status: 401,
                    message: "Email or password not valid"
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

            db.run("INSERT INTO users (email, password, admin) VALUES (?, ?, ?)",
                email,
                hash,
                0,
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }

                    const payload = { email: email };
                    const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                    return res.status(201).json({
                        data: {
                            status: 201,
                            message: "User successfully registered",
                            user: payload,
                            token: token
                        }
                    });
                });
        });
    },

    login: function (req, res) {
        const payload = { email: req.body.email };
        const token = jwt.sign(payload, secret, { expiresIn: '1h'});

        return res.status(200).json({
            data: {
                status: 200,
                message: "User logged in",
                user: payload,
                token: token
            }
        });
    },
};

module.exports = authModel;
