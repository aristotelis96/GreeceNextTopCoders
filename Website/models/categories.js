// Get pool connection from Index
const pool = require('./index').getPool();

getCategories = function (callback){ 
    let query = "SELECT * FROM categories";
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}

module.exports = {getCategories};