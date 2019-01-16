
const pool = require('./index').getPool();

InsertInPrices = function (fields, callback) {
    let vals = " VALUES(" + pool.escape(fields.price) + "," + pool.escape(fields.dateFrom) + "," + pool.escape(fields.dateTo) + "," + pool.escape(fields.productID) + "," + pool.escape(fields.shopID) + "," +pool.escape(fields.userID)+");";
    let query = "INSERT IGNORE INTO prices (price, dateFrom, dateTo, productID, shopID, userID)" + vals;
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

pricesOfUser = function (userId, callback){
    query = "select prices.price, shops.name as shopName, shops.id as shopID, products.name as productName from prices inner join users inner join products inner join shops on prices.shopID=shops.id && prices.productID=products.id && prices.userID=users.id where users.id=" + pool.escape(userId);
    pool.query(query, (err, result)=> {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}
module.exports = { InsertInPrices, pricesOfUser };