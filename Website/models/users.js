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
returnUserByID = function (id, callback) {
    let query = "SELECT * FROM users WHERE id = " + pool.escape(id);
    pool.query(query, (err, results) => {
        if (err){
            return callback(err);
        } else {
            return callback(null, results);
        }
    })
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
    let query_sets = "INSERT INTO users (email, password"
    let query_vals = " VALUES(" + pool.escape(fields.email) +"," + pool.escape(fields.password);
    if(fields.name!= null && fields.name!=''){
        query_sets += ", name";
        query_vals += "," + pool.escape(fields.name);
    }
    if(fields.surname != null && fields.surname!=''){
        query_sets += ", surname";
        query_vals += "," + pool.escape(fields.surname);
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

deleteUserbyId = function (id, callback){
    let query = "DELETE FROM users WHERE id = " + pool.escape(id);
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

updateUser = function (fields, callback){
    let query = "UPDATE users SET email=" + pool.escape(fields.email) 
        + ", password=" + pool.escape(fields.password)         
        + ", name=" + pool.escape(fields.name) 
        + ", surname=" + pool.escape(fields.surname) 
        + "WHERE id=" + pool.escape(fields.id) 
        + ";";
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}
module.exports = {getAllUsers, returnUser, insertUser, deleteUser, deleteUserbyId, updateUser,returnUserByID}