const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

const authModel = {
    login: function (res, body) {
        const payload = { email: body.email };
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
