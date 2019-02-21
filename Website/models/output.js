// Get pool connection from Index
const pool = require('./index').getPool();

getOut = function (fields, callback) {
    let query = "SELECT shops.name as 'shopName', shops.id as 'shopId', products.id, products.name, products.description, products.fileExtension, prices.price FROM shops, prices, products WHERE (shops.id = prices.shopID AND prices.productID = products.id)";
    if (fields.ccheck!= undefined && fields.ccheck != []){
        query += " AND ("
        for (let i=0; i<fields.ccheck.length; i++){
            if (i!=0) 
                query += " OR ";
            query += "products.category = " + pool.escape(fields.ccheck[i]);
        }
        query += ")";
    }
    if (fields.from != null && fields.from != '')
        query += " AND prices.price > " + fields.from;
    if (fields.to != null && fields.to != '')
        query += " AND prices.price <" + fields.to;
    if (fields.limit!= null){
        query += " LIMIT " + fields.limit;
    }
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    }); 
}

module.exports = {getOut};