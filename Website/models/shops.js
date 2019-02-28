const pool = require('./index').getPool();
const dbTags = require('./tags');
const util = require('util');

getAllShops = function (fields, callback) {
    let query = "SELECT * FROM `shops`";    
    if (fields != null) {
        if (fields.status == 'ACTIVE' || fields.status == 'WITHDRAWN') {
            query += " WHERE withdrawn=";
            if (fields.status == 'ACTIVE')
                query += "0";
            if (fields.status == 'WITHDRAWN')
                query += '1';
        }        
        if (fields.sort != null) {
            query += " ORDER BY " + fields.sort.column + " " + fields.sort.AscDesc;
        }
    }
    query += ";";    
    pool.query(query, (err, result) => {
        if (err) {
            console.log('model error');
            return callback(err);
        }
        else {
            (async () => {
                for(let i=0; i<result.length; i++) {
                    result[i].tags = [];
                    var resultTags;
                    try {
                        resultTags = await (util.promisify(dbTags.getShopTags))(result[i].id);
                    } catch (e) {
                        return callback(e.toString());
                    }
                    resultTags.forEach(tag => {
                        result[i].tags.push(tag.name);
                    })
                }
                return callback(null, result);
            })();
        }
    })
}

returnShopByName = function (name, callback) {
    let query = "SELECT * FROM shops WHERE name LIKE CONCAT('%'," + pool.escape(name) + ",'%');";
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}
returnShopByID = function(id, callback){
    let query = "SELECT * FROM shops WHERE id="+ pool.escape(id);
    pool.query(query, (err, resultShop) => {
        if (err) {
            return callback(err);
        }
        else {
            /* Return if you dont find a shop */
            if(resultShop.length == 0){
                return callback(null, resultShop); 
            }
            /* Fetch tags of result shop */
            dbTags.getShopTags(resultShop[0].id, (err,resultTags)=>{
                if(err){
                    return callback(err);
                } else{ 
                    /* Create array of tags inside shop object */
                    resultShop[0].tags = []; 
                    resultTags.forEach(element => {
                        resultShop[0].tags.push(element.name);
                    })
                    /* Return */
                    return callback(null, resultShop);
                }
            })
        }
    })
}
returnExactShop = function (fields, callback) {
    let query = "SELECT * FROM shops WHERE";
    if (fields.name != '' && fields.name != null ) 
        query += " name = " + pool.escape(fields.name);  
    if (fields.phone != '' && fields.phone != null)
        query += " && phone=" + pool.escape(fields.phone);

    if (fields.lng != '' && fields.lng != null)
        query += " && lng=" + pool.escape(fields.lng);
    if (fields.lat != '' && fields.lat != null)
        query += " && lat=" + pool.escape(fields.lat);
    let address = ''
    if (fields.periferia != null)
        address += fields.periferia + ' ';
    if (fields.city != null)
        address += fields.city;
    if (fields.address != null) {
        address += fields.address + ' ';
    }
    if (address != '')
        query += "&& address=" + pool.escape(address);
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}
insertShop = function (fields, callback) {
    let query_sets = "INSERT INTO `website`.`shops` (name";
    let query_vals = "VALUES(" + pool.escape(fields.name);
    let address = '';
    if(fields.periferia != null){
        address += fields.periferia + ' ';
    }
    if(fields.city != null){
        address += fields.city + ' ';
    }
    if(fields.address != null){
        address += fields.address + ' ';
    }
    query_sets += ", address";
    query_vals += "," + pool.escape(address);
    if (fields.phone != '') {
        query_sets += ", phone";
        query_vals += "," + pool.escape(fields.phone);
    }
    if (fields.lng != '' && fields.lat != '') {
        query_sets += ",lng,lat";
        query_vals += "," + pool.escape(fields.lng) + "," + pool.escape(fields.lat);
    }
    if (fields.userID != null) {
        query_sets += ", userID";
        query_vals += "," + pool.escape(fields.userID);
    }
    if(fields.withdrawn != null){
        query_sets += ", withdrawn";
        query_vals += "," + ((pool.escape(fields.withdrawn)).toUpperCase()).replace(/'/g,'');
    }
    query_sets += ")";
    query_vals += ");";
    let query = query_sets + query_vals;
    let tags = fields.tags;
    async function insert() {
        if (tags != null && tags.length > 0) {
            let i;
            try {
                //insert all tags
                let tagsIDs = [];
                for (i = 0; i < tags.length; ++i) {
                    if (tags[i] != '') {
                        await (util.promisify(dbTags.insertTag))(tags[i]);
                        res = await (util.promisify(dbTags.getID))(tags[i]);
                        tagsIDs.push(res[0].id);
                    }
                }
                //insertShop
                shop = await (async () => {
                    // need promises, util.promisify doesnt work with pool.qeury
                    return new Promise((resolve, reject) => {
                        pool.query(query, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        })
                    })
                })();                 
                //last insert tag-shop relation
                for (i = 0; i < tagsIDs.length; ++i)
                    await (util.promisify(dbTags.insertShopTagRelation))(shop.insertId, tagsIDs[i]);
                //return shop result
                return callback(null, shop);
            }
            catch (e) {
                return callback(e);
            }
        }
        //else if no tags are provided just insert shop
        else {
            pool.query(query, (err, result) => {
                if (err)
                    return callback(err);
                else
                    return callback(null, result);
            })
        }
    } insert();

}
deleteShop = function (id, callback) {
    let query = "DELETE FROM shops WHERE id=" + pool.escape(id);
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

/* ---------- Update Shop Function ------- */
/* An xreiazontai epipleon pedia, elegxoume to fields gia ta pedia pou stelnoume kai simplironoume */
/* to query String. P.x. opws gia to withdrawn */
updateShop = async function (shopId, fields, callback) {
    let query = "UPDATE shops SET"
    if(fields.withdrawn == true || fields.withdrawn == false){
        query += " withdrawn =" + fields.withdrawn + ",";
    }
    if(fields.name != null && fields.name != ''){
        query += " name =" + pool.escape(fields.name) + ",";
    }
    if(fields.address != null && fields.address != ''){
        query += " address =" + pool.escape(fields.address) + ",";
    }
    if(fields.lng != null && fields.lng != ''){
        query += " lng =" + pool.escape(fields.lng) + ",";
    }
    if(fields.lat != null && fields.lat != ''){
        query += " lat =" + pool.escape(fields.lat) + ",";
    }
    if(fields.withdrawn != null && fields.withdrawn != ''){
        query += " withdrawn =" + ((pool.escape(fields.withdrawn)).toUpperCase()).replace(/'/g,'') + ",";
    }
    let tags = fields.tags;
    if (tags!= null) {
        let i;
        try {
            //insert all tags
            let tagsIDs = [];
            for (i = 0; i < tags.length; ++i) {
                if (tags[i] != '') {
                    await (util.promisify(dbTags.insertTag))(tags[i]);
                    res = await (util.promisify(dbTags.getID))(tags[i]);
                    tagsIDs.push(res[0].id);
                }
            }
            //erase past tag-shop relations
            await (util.promisify(dbTags.clearShopTagRelation))(shopId)
            // Insert Shop Tag relationship
            for (i = 0; i < tagsIDs.length; ++i)
                await (util.promisify(dbTags.insertShopTagRelation))(shopId, tagsIDs[i]);
        }
        catch (e) {
            return callback(e);
        }
    }
    query = query.substring(0, query.length - 1); 
    query += " WHERE id=" + shopId;
    pool.query(query, (err, result)=>{
        if(err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    });
}
module.exports = { getAllShops, returnShopByName, insertShop, returnExactShop, deleteShop, returnShopByID, updateShop};