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
    if(req.params.id!=null)
        status = 'ALL'; // if user requested specific shop we need to search for everything
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
        const dbTags = require(appDir + '/models/tags');
        for (i = start; (i < end) && (i < result.length); i++) {
            let tags = await (util.promisify(dbTags.getShopTags))(result[i].id);
            let withdrawn;
            if (result[i].withdrawn == 0) withdrawn = false; else withdrawn = true;
            apiResult.shops.push({
                id: result[i].id,
                name: result[i].name,
                address: result[i].address,
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
postShop = function (req, res){
    /* Get body parameters */
    let name = req.body.name;
    if(name == null)
        return res.status(400).json({message: "Bad request"});
    let address = req.body.address;
    if(address == null)
        return res.status(400).json({message: "Bad request"});  
    let lng = req.body.lng;
    if(lng == null || isNaN(lng))
        return res.status(400).json({message: "Bad request"});
    let lat = req.body.lat;
    if(lat == null || isNaN(lat))
        return res.status(400).json({message: "Bad request"});
    /* get tags */
    let tags = req.body.tags;
    if(tags == null)
        return res.status(400).json({message: "Bad request"});
    tags = tags.replace(/"/g,'');
    tags = tags.replace(/\[/g,'');
    tags = tags.replace(/\]/g,'');
    tags = tags.split(',');
    let i = tags.indexOf('');
    if(i!=-1)
        tags.splice(i, 1);
    let withdrawn = req.body.withdrawn;
    if(withdrawn == null)
        return res.status(400).json({message: "Bad request"});
    
    db.insertShop({
        name: name,
        address: address,
        lng: lng,
        lat: lat,
        withdrawn: withdrawn,
        tags: tags
    }, (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Bad request" });
        } else {
            return res.status(200).json({
                id: result.insertId,
                name: name,
                address: address,
                lng: lng,
                lat: lat,
                tags: tags,
                withdrawn: withdrawn
            })
        }
    })
}
module.exports = { getShops, postShop}