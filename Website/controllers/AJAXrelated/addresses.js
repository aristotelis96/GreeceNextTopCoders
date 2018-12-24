db = require(appDir + '/models/addresses');

periferies = function(req, res){
    db.getPeriferies((err, result)=> {
        if(err){
            console.log('ctrl err while fetching periferies', err);
        } else {
            res.json(result);
        }
    })
}
poleis = function (req, res) {
    let periferia = req.query.periferia;
    db.getPoleis(periferia, (err, result) => {
        if(err){
            console.log('ctrl err while fetching poleis', err);
        } else { 
            res.json(result);
        }
    })
}
module.exports = {periferies, poleis}