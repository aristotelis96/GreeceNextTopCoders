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


module.exports = {getAllShops};