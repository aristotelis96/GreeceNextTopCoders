const db = require(appDir + '/models/shops.js');


getShops =  function (req, res) {
    let start = parseInt(req.query.start);
    if (isNaN(start))
        start = 0;
    let count = parseInt(req.query.count);
    if (isNaN(count))
        count = 20;
    let status = req.query.status;
    if (status != 'ALL' && status != 'WITHDRAWN')
        status = 'ACTIVE';
    let sort = req.query.sort;
    if (sort != 'id|ASC' && sort != 'name|ASC' && sort != 'name|DESC')
        sort = 'id|DESC';
    (async () => {
        const util = require('util');
        var result;
        try {
            let [column, AscDesc] = sort.split('|');
            result = await (util.promisify(db.getAllShops))({
                status: status,
                sort: { column: column, AscDesc: AscDesc }
            });
        } catch (e) {
            return res.status(500).send('Internal Server Error ' + e.toString());
        }
        apiResult = {};
        apiResult.start = start;
        apiResult.count = count;
        apiResult.total = result.length;
        apiResult.shops = [];
        let i;
        let end = parseInt(start) + parseInt(count);
        const dbAddress = require(appDir + '/models/addresses');
        const dbTags = require(appDir + '/models/tags');
        for (i = start; (i < end) && (i < result.length); i++) {
            let addressObj = await (util.promisify(dbAddress.getAddress))(result[i].addressID);
            let address = addressObj[0].city + " " + addressObj[0].periferia + " " + result[i].address;
            let tags = await (util.promisify(dbTags.getProductsTags))(result[i].id);
            let withdrawn;
            if (result[i].withdrawn == 0) withdrawn = false; else withdrawn = true;
            apiResult.shops.push({
                id: result[i].id,
                name: result[i].name,
                address: address,
                lng: result[i].lng,
                lat: result[i].lat,
                tags: tags,
                withdrawn: withdrawn
            });
        }
        var id = req.params.id;
        if(id!=null){ // if id was provided in URL (ex. GET /shops/id?..) return specific shop
            for(i=0; i<apiResult.shops.length; i++){
                if(apiResult.shops[i].id==id)
                    return res.status(200).json(apiResult.shops[i]);
            }
            // if none id matched an existing shop return error
            return res.status(404).send('id not found');
        }
        return res.status(200).json(apiResult);
    })();
}
module.exports = { getShops }