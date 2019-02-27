const auth = require('../authentication');

function authentication (req, res, next){
    let token = req.header('X-OBSERVATORY-AUTH');
    if(auth.verify(token))
        next();
    else
        res.status(401).json({message: 'Not authorized, need to login'});
}

module.exports = authentication;