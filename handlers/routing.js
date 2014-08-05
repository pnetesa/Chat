exports.default = require('./default').handleDefault;
exports.map = {
    '/register.json': require('./register').handleRegister,
    '/login.json': require('./login').handleLogin
};
