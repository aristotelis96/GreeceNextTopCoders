const db = require(appDir + '/models/prices.js');
const util = require('util');

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
    if ((geoDist == null)^(geoLng == null)^(geoLat == null))
        return res.status(400).json({message: "bad request"});
    let dateFrom = (new Date(req.query.dateFrom));
    let dateTo = (new Date(req.query.dateTo));
    if ((dateFrom == null)^(dateTo == null))
        return res.status(400).json({message:"bad request"});
    let shops = req.query.shops;
    let products = req.query.products;
    let tags = req.query.tags;
    let sort = req.query
    if (sort != 'geoDist|ASC' && sort != 'geoDist|DESC' && sort != 'price|DESC' && sort != 'date|ASC' && sort != 'date|DESC')
        sort = 'price|ASC';
    (async () =>{
        var result;
        try{
            let [column, AscDesc] = sort.split('|');
            result = await(util.promisify(db.a))({
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
            return res.status(500).send({message: "Internal server error"});
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
                date: result[i].dateTo,
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
    })();
}