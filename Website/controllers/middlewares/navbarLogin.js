
function navbarLogin (req, res, next) {
    req.session.login = false;
    if (req.session.email) {
            req.session.login = true;
        }
    next();
}

module.exports = {navbarLogin}