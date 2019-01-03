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
    module.exports = {getAllProducts}