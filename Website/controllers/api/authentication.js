const jwt = require('jsonwebtoken');
const NodeCache = require('node-cache');
const myCache = new NodeCache();
const config = require(appDir + '/config/config').api.jwt;


getToken = function (user){
    let data = {};
    data.id = user.id;
    data.email = user.email;
    data.name = user.name;
    // TO DO. change secret -> add config parameters
    return jwt.sign({data}, config.secret, {expiresIn: config.ttl}); // 24 hours
}

verify = function(token){
    try{
        jwt.verify(token, config.secret);
    } catch (e){
        return false;
    }
    /* Check if blacklisted */
    let blacked = myCache.get(token);    
    if(blacked == true)
        return false;
    else
        return true;
}

invalidateToken = function(token){
    /* Add token to blacklist */
    return myCache.set(token, true, config.ttl);
}

module.exports = {getToken, verify, invalidateToken}