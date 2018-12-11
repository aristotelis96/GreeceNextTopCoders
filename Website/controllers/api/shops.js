const db = require(appDir + '/models/shops.js');

module.exports = {
    getShops: function (req, res) {
        db.getAllShops((err, result) =>{
            if(err){
                console.error("database error while fetching shops");
                res.status(404).send("error with database");
            }
            else{
                apiResult = {};
                apiResult.shops = result;
                return res.status(200).json(apiResult);
            }
            
        })
    }
}