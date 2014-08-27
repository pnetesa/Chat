function hashCode(text) {

    if (!text) {
        return 0;
    }

    var hash = 0;
    var char;

    for (var i = 0, length = text.length; i < length; i++) {
        char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }

    return hash;
}

function token() {
    return Math.random().toString(36).substr(2);
}

exports.hashCode = hashCode;
exports.token = token;
