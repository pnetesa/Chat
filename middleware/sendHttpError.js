﻿module.exports = function (req, res, next) {
    res.sendHttpError = function (error) {
        res.status(error.status);
        res.json({ message: error.message });
    };

    next();
}