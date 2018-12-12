//critical area appDir
// this should be checked in the future
var path = require('path'); 
var appDir = path.dirname(__dirname);
var password = require('./password.js');
// end of critical area

const config = {
    app: {
        port: process.env.port || 443,
        views: './views',
        viewEngine: 'ejs',
        appDir: appDir,
        apiPort: 8765
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: password, // lu
        database: 'website'
    },
    session: {
        //cookie: { path: '/', httpOnly: true, secure: false, maxAge: null},
        secret: 'VgenapxmsTP7kHPJrHbweo1QaXPe2KfP',
        saveUninitialized: false,
        resave: false
    }
}

module.exports = config;


