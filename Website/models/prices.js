
const pool = require('./index').getPool();

InsertInPrices = function (fields, callback) {
    let vals = " VALUES(" + pool.escape(fields.price) + "," + pool.escape(fields.dateFrom) + "," + pool.escape(fields.dateTo) + "," + pool.escape(fields.productID) + "," + pool.escape(fields.shopID) + ");";
    let query = "INSERT IGNORE INTO prices (price, dateFrom, dateTo, productID, shopID)" + vals;
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

pricesOfUser = function (userId, callback){
    throw new Error('Not Implemented');
}
module.exports = { InsertInPrices, pricesOfUser };