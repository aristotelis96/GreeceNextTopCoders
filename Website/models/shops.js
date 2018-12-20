const pool = require('./index').getPool();

getAllShops = function (callback) {
    let query = "SELECT * FROM `shops`;";
    pool.query(query, (err, result) => {
        if(err){
            console.log('model error');
            return callback(err);
        }
        else {
            return callback(null, result);
        }
    })
}

returnShop = function (name, callback) {
    let query = "SELECT * FROM shops WHERE name LIKE CONCAT('%'," + pool.escape(name) + ",'%');";
    pool.query(query, (err, results) => {
        if(err){
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}


module.exports = {getAllShops, returnShop};