const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const authModel = {
    login: function (req, res) {
        const payload = { email: req.body.email };
        const token = jwt.sign(payload, secret, { expiresIn: '1h'});

        return res.json({
            data: {
                //type: "success",
                //message: "User logged in",
                user: payload,
                token: token
            }
        });
    },
};

module.exports = authModel;
