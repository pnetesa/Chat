exports.default = require('./default').handleDefault;
exports.map = {
    '/register.json': require('./register').handleRegister,
    '/login.json': require('./login').handleLogin,
    '/autologin.json': require('./login').handleAutologin,
    '/logout.json': require('./login').handleLogout,
    '/get-rooms.json': require('./lobby').handleGetRooms,
    '/create-room.json': require('./lobby').handleCreateRoom
};
