const pool = require('./index').getPool();
            
const dbTag = require('./tags');
const util = require('util');

getAllProducts = function (callback) {
    let query = "SELECT * FROM `products` ORDER BY name ASC";
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, result);
        }
    });
}
returnProduct = function (name, callback) {
    let query = "SELECT * FROM products WHERE name = " + pool.escape(name);
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}

returnProductByName = function (fields, callback) {
    let query = "SELECT * FROM products WHERE name LIKE CONCAT('%'," + pool.escape(fields.name) + ",'%')";
    if(fields.category != null){
        query += " && category=" + pool.escape(fields.category);
    }
    query += ";";
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}

InsertInProducts = function (fields, callback) {
    let query = "INSERT IGNORE INTO products (name, description, category ";
    let vals = " VALUES(" + pool.escape(fields.name) + "," + pool.escape(fields.description) + "," + pool.escape(fields.category) ;
    if(fields.extraData != null){
        query += ",extra_data";
        vals += "," + pool.escape(fields.extraData);
    }
    query += ")";
    vals +=");";

    query += vals;
    let tags = fields.tags;
    (async () => {
        if (tags != null && tags.length > 0) {
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
                //insert product
                product = await (async () => {
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
                // last insert tag - product relation
                for (i = 0; i < tagsIDs.length; i++)
                    await (util.promisify(dbTag.insertProductTagRelation))(product.insertId, tagsIDs[i]);
                return callback(null, product);
            } catch (e) {
                return callback(e);
            }
        } else { // if no tags are provided just insert product 
            pool.query(query, (err, result) => {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, result);
                }
            })
        }
    })();
}
returnProductID = function (name, callback) {
    let query = "SELECT id FROM products WHERE name = " + pool.escape(name);
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}

returnProductById = function (id, callback) {
    let query = "SELECT * FROM products WHERE id = " + pool.escape(id);
    pool.query(query, (err, results)=>{
        if(err){
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}
module.exports = { getAllProducts, returnProduct, returnProductByName, InsertInProducts, returnProductID, returnProductById}