// Get pool connection from Index
const pool = require('./index').getPool();

// get All users from database
getAllUsers = function (callback) {
    let query = "SELECT * FROM `users` ORDER BY email ASC"; // query database to get all the users
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    }); 
}

returnUser = function (email, callback) {
    let query = "SELECT * FROM users WHERE email = " + pool.escape(email);
    pool.query(query, (err, results) => {
        if (err){
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
}

insertUser = function (fields, callback) {
    let query_sets = "INSERT INTO users (email, password, image, user_or_shop"
    let query_vals = " VALUES(" + pool.escape(fields.email) +"," + pool.escape(fields.password) + "," + pool.escape(fields.image) +"," + pool.escape(fields.user_or_shop);
    if(fields.name!= null && fields.name!=''){
        query_sets += ", name";
        query_vals += "," + pool.escape(fields.name);
    }
    if(fields.surname != null && fields.surname!=''){
        query_sets += ", surname";
        query_vals += "," + pool.escape(fields.surname);
    }
    if(fields.shopID != null){
        query_sets += ", shopID";
        query_vals += "," + pool.escape(fields.shopID);
    }
    query_sets += ")";
    query_vals += ");";
    let query = query_sets+query_vals;
    pool.query(query, (err,result) => {
        if(err) {
            return callback(err);
        } else {
            return callback (null, result);
        }
    })
}

deleteUser = function (email, callback){
    let query = "DELETE FROM users WHERE email = " + pool.escape(email);
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}
module.exports = {getAllUsers, returnUser, insertUser, deleteUser}