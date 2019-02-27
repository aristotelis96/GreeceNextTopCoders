const db = require(appDir + '/models/shops.js');
const auth = require('./authentication');
const util = require('util');

getShops =  function (req, res) {
    var id = req.params.id;
    if(id!=null){ // if id was provided in URL (ex. GET /shops/id?..) return specific shop
        let apiResult = {};
        if(isNaN(id)){
            return res.status(400).send({message: "Bad request", err: "id is NaN"});
        }
        return db.returnShopByID(id, (err, result)=>{
            if(err){
                return res.status(500).send({message: "internal server error", err: err})
            } else {
                if(result.length == 0){
                    return res.status(404).send({message: "Id not found"});
                }
                let withdrawn;
                if (result[0].withdrawn == 0) withdrawn = false; else withdrawn = true;
                apiResult = {
                    id: result[0].id,
                    name: result[0].name,
                    address: result[0].address,
                    lng: result[0].lng,
                    lat: result[0].lat,
                    tags: result[0].tags,
                    withdrawn: withdrawn
                }
                return res.status(200).send(apiResult);
            }
        })
    }
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
        var result;
        try {
            let [column, AscDesc] = sort.split('|');
            result = await (util.promisify(db.getAllShops))({
                status: status,
                sort: { column: column, AscDesc: AscDesc }
            });
        } catch (e) {
            return res.status(500).send({message: "Internal server error", err: e});
        }
        apiResult = {};
        apiResult.start = start;
        apiResult.count = count;
        apiResult.total = result.length;
        apiResult.shops = [];
        let i;
        let end = parseInt(start) + parseInt(count);
        for (i = start; (i < end) && (i < result.length); i++) {
            let withdrawn;
            if (result[i].withdrawn == 0) withdrawn = false; else withdrawn = true;
            apiResult.shops.push({
                id: result[i].id,
                name: result[i].name,
                address: result[i].address,
                lng: result[i].lng,
                lat: result[i].lat,
                tags: result[i].tags,
                withdrawn: withdrawn
            });
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
            return res.status(500).json({ message: "Internal Server Error" , err: err.toString()});
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

putShop = function (req, res) {
    /* Get id parameters */
    let shopId = req.params.id;
    if(isNaN(shopId)){
        return res.status(400).json({message: "Bad request", err: "id is NaN"});
    }
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
    db.updateShop(shopId, {
        name: name,
        address: address,
        lng: lng,
        lat: lat,
        withdrawn: withdrawn,
        tags: tags
    }, (err, result)=>{
        if (err) {
            return res.status(500).json({ message: "Internal Server Error", err: err.toString()});
        } else {
            if(result.affectedRows == 0)
                return res.status(404).json({message: "Not Found", err: "id not found"})
            else
                return res.status(200).json({
                    id: shopId,
                    name: name,
                    address: address,
                    lng: lng,
                    lat: lat,
                    tags: tags,
                    withdrawn: withdrawn
                })
        }
    });
}

deleteShop = function (req, res){
    let token = req.header('X-OBSERVATORY-AUTH')
    let data = auth.decode(token).data;
    let shopId = req.params.id;
    if(isNaN(shopId)){
        return res.status(400).send({message: "Bad request", err: "id is NaN"});
    }
    /* If administrator , delete shop permanently */
    if(data.email == "admin@admin") {
        db.deleteShop(shopId, (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: err
                })
            } else {
                if(result.affectedRows == 1)
                    return res.status(200).json({message: 'OK'});
                else
                    return res.status(404).json({message: "Not Found", err: "id not found"})
            }
        })
    }
    /* If not administrator just set Withdrawn = true */
    else {
        fields = {};
        fields.withdrawn = true;
        db.updateShop(shopId, fields, (err, result)=>{
            if(err){
                return res.status(500).json({
                    message: "Internal Server Error",
                    error: err
                })
            } else {
                if(result.affectedRows == 1)
                    return res.status(200).json({message: 'OK'});
                else
                    return res.status(404).json({message: "Not Found", err: "id not found"})
            }
        })
    }
}
module.exports = { getShops, postShop, deleteShop, putShop}