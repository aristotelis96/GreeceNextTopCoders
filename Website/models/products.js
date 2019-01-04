const pool = require('./index').getPool();


    getAllProducts = function(callback){
        let query = "SELECT * FROM `products` ORDER BY name ASC";
        pool.query(query, (err, result) => {
            if(err){
                return callback(err);
            }
            else{
                return callback(null, result);
            }
        });
    }
    returnProduct = function (name, callback) {
        let query = "SELECT * FROM products WHERE name = " + pool.escape(name);
        pool.query(query, (err, results) => {
            if (err){
                return callback(err);
            } else {
                return callback(null, results);
            }
        })
    }
    InsertInProducts = function (fields, callback){
        let vals = " VALUES(" + pool.escape(fields.name) + "," + pool.escape(fields.description) + "," + pool.escape(fields.category) + ");" ;
        let query = "INSERT INTO products (name, description, category)" + vals;
        pool.query(query, (err,result)=>{
            if(err) {
                return callback(err);
            } else {
                return callback (null, result);
            }
        })
    }
    returnProductID = function (name, callback) {
        let query = "SELECT id FROM products WHERE name = " + pool.escape(name);
        pool.query(query, (err, results) => {
            if (err){
                return callback(err);
            } else {
                return callback(null, results);
            }
        })
    }
    InsertInPrices = function (fields, callback){
        let vals = " VALUES(" + pool.escape(fields.price) + "," + pool.escape(fields.dateFrom) + "," + pool.escape(fields.dateTo) +"," + pool.escape(fields.productID)+"," + pool.escape(fields.shopID) + ");" ;
        let query = "INSERT INTO prices (price, dateFrom, dateTo, productID, shopID)" + vals;
        pool.query(query, (err,result)=>{
            if(err) {
                return callback(err);
            } else {
                return callback (null, result);
            }
        })
    }
    returnShopID = function (name, callback) {
        let query = "SELECT id FROM shops WHERE name = " + pool.escape(name);
        pool.query(query, (err, results) => {
            if (err){
                return callback(err);
            } else {
                return callback(null, results);
            }
        })
    }
    module.exports = {getAllProducts, returnProduct, InsertInProducts, returnProductID, InsertInPrices, returnShopID}