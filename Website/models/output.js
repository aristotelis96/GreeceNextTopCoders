// Get pool connection from Index
const pool = require('./index').getPool();

getOut = function (fields, callback) {
    let query = "SELECT shops.name, product.name, prices.price FROM shops, prices, produts WHERE (shops.id = prices.shopID AND prices.productID = products.id)";
    if (fields.category != "")
        query += "AND" + fields.category;
    if (fields.from != null)
        query += "AND prices.dateFrom=" + fields.from;
    if (fields.to != null)
        query += "AND prices.dateTo=" + fields.to;    
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    }); 
}

