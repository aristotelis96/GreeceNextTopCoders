const db = require(appDir + '/models/tags.js');

getTags = function (req, res){
    db.getTagNames(req.query.name, (err, result) =>{
        if(err)
            res.send(err);
        else{
            res.json(result);
        }
    })
}

module.exports = {getTags}