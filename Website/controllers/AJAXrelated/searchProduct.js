const db = require(appDir + '/models/products');

module.exports = {
    searchProduct: function (req, res){
        var name = req.query.name;
        let fields = {name: name};
        if(req.query.category != undefined){
            fields.category = req.query.category;
        }
        db.returnProductByName(fields, (err,result) => {
            if(err){
                console.error("error in searchShop ctrl DB access");
            }
            else {
                res.json(result);
            }
        })
    }
}