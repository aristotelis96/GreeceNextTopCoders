const db = require(appDir + '/models/shops');

module.exports = {
    searchShop: function (req, res){
        var name = req.query.name;
        db.returnShopByName(name, (err,result) => {
            if(err){
                console.error("error in searchShop ctrl DB access");
            }
            else {
                res.json(result);
            }
        })
    }
}