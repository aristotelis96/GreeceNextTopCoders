const db = require(appDir + '/models/prices.js');
const util = require('util');
const auth = require('./authentication');
const http = require('http');

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
    dateFrom = dateFrom.getFullYear() + "-" + ("0" + (dateFrom.getMonth()+1)).slice(-2) + "-" + ("0" + (dateFrom.getDate())).slice(-2);
    dateTo = dateTo.getFullYear() + "-" + ("0" + (dateTo.getMonth()+1)).slice(-2) + "-" + ("0" + (dateTo.getDate())).slice(-2);
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
postPrices = async function(req,res){
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
    dateFrom = dateFrom.getFullYear() + "-" + ("0" + (dateFrom.getMonth()+1)).slice(-2) + "-" + ("0" + (dateFrom.getDate())).slice(-2);
    dateTo = dateTo.getFullYear() + "-" + ("0" + (dateTo.getMonth()+1)).slice(-2) + "-" + ("0" + (dateTo.getDate())).slice(-2);
    let token = req.header('X-OBSERVATORY-AUTH')
    let data = auth.decode(token).data;    
    /* Check if price/offer already exists */
    let check = await (util.promisify(db.getPrice))({
        productID: productId,
        shopID: shopId,
        price: price,
        dateFrom: dateFrom,
        dateTo: dateTo,
    })
    if(check.length>0){    
        await (util.promisify(db.deletePrice))(check[0].id)
    }    
    db.InsertInPrices({
        price:price,
        dateFrom:dateFrom,
        dateTo:dateTo,
        productID:productId,
        shopID:shopId,
        userID:data.id
    }, async (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Internal Server Error", err: err.toString() });
        } else {
            var result;
            try {                
                result = await(util.promisify(db.getPrices))({                                        
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    shops: [shopId],
                    products: [productId],                    
                    sort: { column: 'price', AscDesc: 'ASC' }
                });
            } catch (e) {
                return res.status(500).send({ message: "Internal server error", err: e.toString() });
            }
            let apiResult = {};
            apiResult.start = 0;
            apiResult.count = 20;
            apiResult.total = result.length;
            apiResult.prices = [];
            let i;
            for (i = 0; (i < 20) && (i < result.length); i++) {
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
        }
    })

}
module.exports = {getPrices, postPrices}