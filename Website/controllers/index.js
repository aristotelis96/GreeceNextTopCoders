const session = require('express-session');
const db = require(appDir + '/models/users.js');

module.exports = {
    getHomePage: (req, res) => {
        var sess = req.session;
        req.session.login = false;
        if (sess.email) {
            req.session.login = true;
        }
        // Ask model for users and render view
        db.getAllUsers((err, result) => {
            if (err) {
                return res.status(500).send(err);
            }        
            res.render('index.ejs', {
                title: "GNTC",
                users: result,
                login: req.session.login,
                name: req.session.email
            });
        });

    }
};