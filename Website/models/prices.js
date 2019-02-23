
const pool = require('./index').getPool();

InsertInPrices = function (fields, callback) {
    let vals = " VALUES(" + pool.escape(fields.price) + "," + pool.escape(fields.dateFrom) + "," + pool.escape(fields.dateTo) + "," + pool.escape(fields.productID) + "," + pool.escape(fields.shopID) + "," +pool.escape(fields.userID)+");";
    let query = "INSERT INTO prices (price, dateFrom, dateTo, productID, shopID, userID)" + vals;
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

pricesOfUser = function (userId, callback){
    query = "select prices.price, shops.name as shopName, shops.id as shopID, products.name as productName, products.id as productid from prices inner join users inner join products inner join shops on prices.shopID=shops.id && prices.productID=products.id && prices.userID=users.id where users.id=" + pool.escape(userId);
    pool.query(query, (err, result)=> {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}
pricesOfShop = function(shopId,callback){
    query = "select prices.price as productPrice,products.id as productId, products.name as productName, prices.dateFrom as productDateFrom, prices.dateTo as productDateTo, products.description as productDescription, products.category as productCategory, products.withdrawn as productWithdrawn from prices inner join products on prices.productID=products.id && prices.shopID="+ pool.escape(shopId);
    pool.query(query, (err, result)=> {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}
getPrice = function (fields, callback){
    query = "SELECT * FROM prices WHERE productID=" + pool.escape(fields.productID) + " AND shopID=" + pool.escape(fields.shopID) + " AND price=" + pool.escape(fields.price);
    if(fields.dateFrom != 'NULL' && fields.dateFrom != '' && fields.dateFrom != null){
        query += " AND dateFROM=" + pool.escape(fields.dateFrom);
    }
    if(fields.dateTo != 'NULL' && fields.dateTo != '' && fields.dateTo != null){
        query += " AND dateTo=" + pool.escape(fields.dateTo);
    }
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else {
            return callback(null, result);
        }
    })
}
module.exports = { InsertInPrices, pricesOfUser, pricesOfShop, getPrice};