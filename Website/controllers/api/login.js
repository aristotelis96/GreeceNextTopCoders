const auth = require('./authentication');
const dbUser = require(appDir + '/models/users');
const bcrypt = require('bcrypt');

login = function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    dbUser.returnUser(user, (err, result) => {
        if (err) {
            return res.status(500).send({message: "Internal server error", err: err});
        } else {
            if (result.length == 0)
                return res.status(404).json({ message: 'User not found' });
            if (bcrypt.compareSync(pass, result[0].password)) {
                let token = auth.getToken(result[0]);
                res.status(200).json({ token: token });
            } else {
                res.status(400).json({ message: 'Wrong password' });
            }
        }
    });
}

logout = function (req, res) {
    let token = req.header('X-OBSERVATORY-AUTH');
    if (auth.verify(token)) {
        auth.invalidateToken(token);
        res.json({ message: 'OK' });
    } else {
        res.status(403).json({ message: 'Invalid Token' });
    }
}

module.exports = { login, logout };