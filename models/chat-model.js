const mongo = require('mongodb').MongoClient;
const dsn = 'mongodb://localhost:27017/chat';

const chatModel = {
    loadMessages: function (req, res) {
        mongo.connect(dsn, (err, client) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }

            const db = client.db();
            const col = db.collection('messages');

            col.find().toArray((err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Database error"
                        }
                    });
                }
                console.log(result);
                client.close();
                return res.status(200).json({
                    data: result
                });
            });
        });
    },

    saveMessages: function (req, res) {
        const messages = req.body.messages;

        mongo.connect(dsn, (err, client) => {
            if (err) {
                return res.status(500).json({
                    error: {
                        status: 500,
                        message: "Database error"
                    }
                });
            }

            const db = client.db();
            const col = db.collection('messages');

            col.deleteMany({}, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            message: "Database error"
                        }
                    });
                }
                console.log(result);
                col.insertMany(messages, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                message: "Database error"
                            }
                        });
                    }
                    console.log(result);
                    client.close();
                    return res.status(201).json({
                        data: {
                            status: 201,
                            message: "Messages successfully saved"
                        }
                    });
                });
            });
        });
    }
};

module.exports = chatModel;
