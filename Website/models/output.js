// Get pool connection from Index
const pool = require('./index').getPool();

getOut = function (fields, callback) {
    let query = "SELECT shops.name, products.name, prices.price FROM shops, prices, products WHERE (shops.id = prices.shopID AND prices.productID = products.id)";
    if (fields.ccheck != []){
        query += " AND ("
        for (let i=0; i<fields.ccheck.length; i++){
            if (i!=0) 
                query += " OR ";
            query += "products.category = " + pool.escape(fields.ccheck[i]);
        }
        query += ")";
    }
    if (fields.from != '')
        query += " AND prices.price > " + fields.from;
    if (fields.to != '')
        query += " AND prices.price <" + fields.to;
        console.log(query)    
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