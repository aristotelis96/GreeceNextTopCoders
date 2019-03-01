const pool = require('./index').getPool();
            
const dbTag = require('./tags');
const util = require('util');

getAllProducts = function (fields,callback) {
    let query = "SELECT * FROM `products`"; // ORDER BY name ASC";
    if(fields != null){
        if (fields.status == 'ACTIVE')
            query += " WHERE withdrawn=0 ";
        else if (fields.status == 'WITHDRAWN')
            query += " WHERE withdrawn=1 ";
        if (fields.sort != null)
            query += "ORDER BY " + fields.sort.column + " " + fields.sort.AscDesc;
    }
    query += ";";
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            if(results.length == 0)
                return callback(null, results);

            dbTag.getProductsTags(results[0].id, (err,resTags)=>{
                if (err)
                    return callback(err);
                else{
                    results[0].tags = [];
                    resTags.forEach(element => {
                        results[0].tags.push(element.name);
                    });
                    return callback(null, results);
                }                    
            })
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
    if(fields.withdrawn != null){
        query += ",withdrawn";
        vals += "," + pool.escape(fields.withdrawn);
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
        } 
        else {
            if(results.length == 0)
                return callback(null, results);

            dbTag.getProductsTags(results[0].id, (err,resTags)=>{
                if (err)
                    return callback(err);
                else{
                    results[0].tags = [];
                    resTags.forEach(element => {
                        results[0].tags.push(element.name);
                    });
                    return callback(null, results);
                }                    
            })
        }
    })
}

returnOfferById = function (id, callback){
    let query = "SELECT shops.name as 'shopName', shops.id as 'shopId', products.id, products.name, products.description, prices.price, prices.dateFrom, prices.dateTo FROM shops, prices, products WHERE (products.id =" + pool.escape(id) + "AND shops.id = prices.shopID AND prices.productID = products.id)";
    pool.query(query, (err, results)=>{
        if(err){
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}

updateProduct = async function(fields, callback){
    let query = "UPDATE products SET id =" + fields.id + ',' ;
    if(fields.description != null && fields.description != ''){
        query += " description =" + pool.escape(fields.description) + ",";
    }
    if(fields.name != null && fields.name != '')
        query += " name =" + pool.escape(fields.name) + ",";
    if(fields.category !=null && fields.category != '')
        query += " category =" + pool.escape(fields.category) + ",";
    if(fields.extraData != null && fields.extraData != '')
        query += " extra_data=" + pool.escape(fields.extraData) + ",";
    if(fields.withdrawn != null && fields.withdrawn != '')
        query += " withdrawn =" + ((pool.escape(fields.withdrawn)).toUpperCase()).replace(/'/g,'') + ",";
    let tags = fields.tags;
    if (tags!= null) {
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
            //erase past tag-product relations
            await (util.promisify(dbTag.clearProductTagRelation))(fields.id)
            // Insert Shop Tag relationship
            for (i = 0; i < tagsIDs.length; ++i)
                await (util.promisify(dbTag.insertProductTagRelation))(fields.id, tagsIDs[i]);
        }
        catch (e) {
            return callback(e);
        }
    }
    query = query.substring(0, query.length - 1);
        
    query += " WHERE id =" + pool.escape(fields.id);
    pool.query(query, (err, results)=>{
        if(err){
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}
deleteProduct = function (id, callback) {
    let query = "DELETE FROM products WHERE id=" + pool.escape(id);
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}
module.exports = { getAllProducts, returnProduct, returnProductByName, InsertInProducts, returnProductID, returnProductById, returnOfferById, updateProduct, deleteProduct}