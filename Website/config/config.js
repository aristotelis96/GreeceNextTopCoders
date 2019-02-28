//critical area appDir
// this should be checked in the future
var path = require('path');
var appDir = path.dirname(__dirname);
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
        /****** MySQL Server is hosted @ Okeanos VM. Change to 'root'@'localhost' for local mysql server ******/
        host: '83.212.74.151', //change to 'localhost'
        user: 'root', //change to 'root'
        password: 'password', // password // from require('./password.js');
        database: 'website'
    },
    session: {
        //cookie: { path: '/', httpOnly: true, secure: false, maxAge: null},
        secret: 'VgenapxmsTP7kHPJrHbweo1QaXPe2KfP',
        saveUninitialized: false,
        resave: false
    },
    api:
    {
        jwt:
        {
            secret: "MGA5CN4rOd3l7E4fR90OK6rox8PWa4I5",
            ttl: 86400
        }
    }
}

module.exports = config;


