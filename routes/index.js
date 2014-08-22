var authorize = require('../middleware/authorize');

module.exports = function (app) {
    app.post('/register', require('./register').post);

    app.post('/login', require('./login').post);
    app.get('/autologin', require('./login').get); // ??? session

    app.post('/logout', require('./logout').post);

    app.get('/get-rooms', authorize.get,  require('./lobby').get);
    app.post('/create-room', authorize.post, require('./lobby').post);

    app.get('/get-history', require('./room').get);
    app.post('/upload-file', require('./room').post);
};