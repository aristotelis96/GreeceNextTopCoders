const pool = require('./index').getPool();

insertTag = function (tag, callback) {
    let query = "INSERT IGNORE INTO tags (name) VALUES (" + pool.escape(tag) + ");";
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}
getID = function (tag, callback) {
    let query = "SELECT id FROM tags WHERE name=" + pool.escape(tag);
    pool.query(query, (err, result) => {
        if (err)
            return callback(err);
        else
            return callback(null, result);
    })
}
insertShopTagRelation = function (shopID, tagID, callback) {
    let query = "INSERT IGNORE INTO categorized_shop (shopID, tagID) VALUES (" + pool.escape(shopID) + "," + pool.escape(tagID) + ");";
    pool.query(query, (err, result) => {
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
clearShopTagRelation = function (shopId, callback){
    let query = "DELETE FROM categorized_shop WHERE shopId =" + pool.escape(shopId);
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
insertProductTagRelation = function (productID, tagID, callback) {
    let query = "INSERT IGNORE INTO categorized_product (productID, tagID) VALUES (" + pool.escape(productID) + "," + pool.escape(tagID) + ");";
    pool.query(query, (err, result) => {
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
clearProductTagRelation = function (productId, callback){
    let query = "DELETE FROM categorized_product WHERE productID =" + pool.escape(productId);
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
getTagNames = function (name, callback){
    let query = "SELECT name FROM tags WHERE name LIKE (CONCAT("+pool.escape(name)+",'%'))";
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback (null, result);
    })
}
getProductsTags = function (id, callback){
    let query = "SELECT tags.name FROM (tags INNER JOIN categorized_product ON categorized_product.tagID = tags.id) WHERE categorized_product.productID =" + pool.escape(id) +";";
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
getShopTags = function(id, callback){
    let query = "SELECT tags.name FROM (tags INNER JOIN categorized_shop ON categorized_shop.tagID = tags.id) WHERE categorized_shop.shopID =" + pool.escape(id) +";";
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback(null, result);
    })
}
module.exports = { insertTag, getID, insertShopTagRelation, getTagNames, insertProductTagRelation, clearProductTagRelation, getProductsTags,getShopTags, clearShopTagRelation}