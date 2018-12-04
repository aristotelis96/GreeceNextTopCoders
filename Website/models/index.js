var config = require('../config/config.js');
var mysql = require('mysql')
var async = require('async')

var pool;

initialize = function () {
    pool = mysql.createPool(config.db);
}
getPool = function (){
    return pool;
}
module.exports = { initialize, getPool}