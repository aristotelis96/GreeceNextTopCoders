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

getTagNames = function (name, callback){
    let query = "SELECT name FROM tags WHERE name LIKE (CONCAT("+pool.escape(name)+",'%'))";
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err);
        else
            return callback (err, result);
    })
}
module.exports = { insertTag, getID, insertShopTagRelation, getTagNames}