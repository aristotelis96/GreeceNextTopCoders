const auth = require('../authentication');

function verification (req, res, next){
    let token = req.header('X-OBSERVATORY-AUTH');
    if(auth.verify(token))
        next();
    else
        res.status(403).json({message: 'Forbidden, need to login'});
}

module.exports = verification;