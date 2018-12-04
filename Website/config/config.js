//critical area appDir
// this should be checked in the future
var path = require('path'); 
var appDir = path.dirname(__dirname);
// end of critical area

const config = {
    app: {
        port: process.env.port || 8080,
        views: './views',
        viewEngine: 'ejs',
        appDir: appDir
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: '8elopass',
        database: 'website'
    },
    session: {
        //cookie: { path: '/', httpOnly: true, secure: false, maxAge: null},
        secret: 'a',
        saveUninitialized: false,
        resave: false
    }
}

module.exports = config;


