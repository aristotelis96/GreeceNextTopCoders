// Get pool connection from Index
const pool = require('./index').getPool();

// get All users from database
getAllUsers = function (callback) {
    let query = "SELECT * FROM `users` ORDER BY email ASC"; // query database to get all the players
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

insertUser = function (email, password, image, callback) {
    let query = "INSERT INTO users (email, password, image) VALUES (" + pool.escape(email) + ",'" + password + "', " + pool.escape(image) + ");"; // password is encrypted, no escaping done
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