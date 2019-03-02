const db = require(appDir + '/models/prices.js');
const util = require('util');
const auth = require('./authentication');

getPrices = function (req, res){
    let apiResult ={};
    let start = parseInt(req.query.start);
    if (isNaN(start))
        start = 0;
    let count = parseInt(req.query.count);
    if (isNaN(count)) 
        count = 20;
    let geoDist = parseInt(req.query.geoDist);
    let geoLng = parseFloat(req.query.geoLng);
    let geoLat = parseFloat(req.query.geoLat);
    if (!(((req.query.geoDist == null) && (req.query.geoLng == null) && (req.query.geoLat == null)) || ((req.query.geoDist != null) && (req.query.geoLng != null) && (req.query.geoLat != null)) ))
        return res.status(400).json({message: "bad request"});
    let dateFrom = (new Date(req.query.dateFrom));
    let dateTo = (new Date(req.query.dateTo));
    if ((req.query.dateFrom == null)^(req.query.dateTo == null))
        return res.status(400).json({message:"bad request"});
    if((req.query.dateFrom == null) && (req.query.dateTo == null)){
        dateFrom = new Date();
        dateTo = new Date();
    }
    dateFrom = dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-" + dateFrom.getDate();
    dateTo = dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-" + dateTo.getDate();
    let shops = req.query.shops;
    if (!Array.isArray(shops) && shops != undefined)
        shops = [shops];
    let products = req.query.products;
    if (!Array.isArray(products) && products != undefined)
        products = [products];
    let tags = req.query.tags;
    if (!Array.isArray(tags) && tags != undefined)
        tags = [tags]; // if only 1 tag is inserted, req.body.tags returns a just a string, but we need array
    let sort = req.query.sort;
    if (sort != 'geoDist|ASC' && sort != 'geoDist|DESC' && sort != 'price|DESC' && sort != 'date|ASC' && sort != 'date|DESC')
        sort = 'price|ASC';
    (async () =>{
        var result;
        try{
            let [column, AscDesc] = sort.split('|');            
            result = await(util.promisify(db.getPrices))({
                geoDist: geoDist,
                geoLng: geoLng,
                geoLat: geoLat,
                dateFrom: dateFrom,
                dateTo: dateTo,
                shops: shops,
                products: products,
                tags: tags,
                sort: { column: column, AscDesc: AscDesc }
            });
        }catch(e){
            return res.status(500).send({message: "Internal server error", err: e.toString()});
        }
        apiResult.start = start;
        apiResult.count = count;
        apiResult.total = result.length;
        apiResult.prices = [];
        let i;
        let end =parseInt(start)+parseInt(count);
        for (i = start; (i < end) && (i < result.length); i++) {
            apiResult.prices.push({
                price: result[i].price,
                date: result[i].date,
                productName: result[i].productName,
                productId: result[i].productId,
                productTags: result[i].productTags,
                shopId: result[i].shopId,
                shopName: result[i].shopName,
                shopTags: result[i].shopTags,
                shopAddress: result[i].shopAddress,
                shopDist: result[i].shopDist
            });
        }
        return res.json(apiResult);
    })();
}
postPrices = function(req,res){
    let price = req.body.price;
    if (price == null)
        return res.status(400).json({message: "Bad request"});
    let dateFrom = (new Date(req.body.dateFrom));
    if (req.body.dateFrom == null)
        return res.status(400).json({message: "Bad request"});
    let dateTo = (new Date(req.body.dateTo));
    if (req.body.dateTo == null)
            return res.status(400).json({message: "Bad request"});
    let productId = parseInt(req.body.productId);
    if (productId == null)
        return res.status(400).json({message: "Bad request"});
    let shopId = parseInt(req.body.shopId);
    if (shopId == null)
        return res.status(400).json({message: "Bad request"});
    let token = req.header('X-OBSERVATORY-AUTH')
    let data = auth.decode(token).data;        
    db.InsertInPrices({
        price:price,
        dateFrom:dateFrom,
        dateTo:dateTo,
        productID:productId,
        shopID:shopId,
        userID:data.id
    },(err,result) => {
        if (err){
            return res.status(500).json({message: "Internal Server Error" , err: err.toString()});
        } else{
            
        }
    })

}
module.exports = {getPrices, postPrices}