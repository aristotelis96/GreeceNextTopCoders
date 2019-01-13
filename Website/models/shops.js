const pool = require('./index').getPool();

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
            return callback(null, result);
        }
    })
}

returnShop = function (name, callback) {
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
returnExactShop = function (fields, callback) {
    let query = "SELECT * FROM shops WHERE";// name = " + pool.escape(fields.name);
    if (fields.name != '' && fields.name != null ) // if no name is given, it will search with id
        query += " name = " + pool.escape(fields.name);
    else 
        query += " id = " + pool.escape(fields.id);
    if (fields.phone != '' && fields.phone != null)
        query += " && phone=" + pool.escape(fields.phone);

    if (fields.lng != '' && fields.lng != null)
        query += " && lng=" + pool.escape(fields.lng);
    if (fields.lat != '' && fields.lat != null)
        query += " && lat=" + pool.escape(fields.lat);
    if (fields.periferia != '' && fields.city != '' && fields.periferia != null && fields.city != null)
        query += " && addressID= (SELECT id FROM addresses WHERE periferia=" + pool.escape(fields.periferia) + " && city=" + pool.escape(fields.city) + ")";
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
    if (fields.periferia != null && fields.poli != null) {
        query_sets += ", addressID";
        query_vals += ", (SELECT id FROM addresses WHERE periferia=" + pool.escape(fields.periferia) + "&& city=" + pool.escape(fields.poli) + ")"
    }
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
    query_sets += ")";
    query_vals += ");";
    let query = query_sets + query_vals;
    let tags = fields.tags;
    async function insert() {
        if (tags != null && tags.length > 0) {
            const dbTag = require('./tags');
            const util = require('util');
            let i;
            try {
                //insert all tags
                let tagsIDs = [];
                for (i = 0; i < tags.length; ++i) {
                    if (tags[i] != '') {
                        await (util.promisify(dbTag.insertTag))(tags[i]);
                        res = await (util.promisify(dbTag.getID))(tags[i]);
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
                    await (util.promisify(dbTag.insertShopTagRelation))(shop.insertId, tagsIDs[i]);
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
module.exports = { getAllShops, returnShop, insertShop, returnExactShop, deleteShop };