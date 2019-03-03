const pool = require('./index').getPool();

getRowCounts = function (callback) {
    let query = "SELECT COUNT(DISTINCT users.id) AS users, COUNT(DISTINCT shops.id) AS shops, COUNT(DISTINCT products.id) AS products, COUNT(DISTINCT prices.id) AS prices FROM prices, users, shops, products;"    
    pool.query(query, (err, result)=>{
        if(err)
            return callback(err)
        else
            return callback(null, result);
    })
}

module.exports = {getRowCounts}