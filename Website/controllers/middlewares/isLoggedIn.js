
    module.exports = isLoggedIn = function(req, res, next) {
        if(req.session.login){
            res.redirect('/');
        } else{
            next();
        }
    }


