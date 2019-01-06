const pool = require('./index').getPool();

getPeriferies = function (callback) {
    let query = "SELECT `addresses`.`periferia` FROM `website`.`addresses` GROUP BY `website`.`addresses`.`periferia` ORDER BY periferia;";
    pool.query(query, (err,result) => {
        if(err){
            console.log('model Getperiferia err', err);
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

getPoleis = function (periferia, callback) { 
    let query = "SELECT addresses.city FROM addresses WHERE periferia=" + pool.escape(periferia) + "ORDER BY city";
    pool.query(query, (err, result) => {
        if(err){
            console.log('model getPoleis err', err);
        } else {
            return callback(null, result);
        }
    })
}
getID = function (periferia, poli, callback){
    let query = "SELECT id FROM addresses WHERE city=" + pool.escape(poli) + " && periferia=" + pool.escape(periferia);
    pool.query(query, (err, result)=>{
        if(err){
            callback(err);
        }
        else{
            if(result.length>0)
                callback(result[0].id);
            else   
                callback(null);
        }
    })
}
getAddress = function (id, callback){
    if(id==0) // empty addressID
        return callback(null, [{city: '', periferia: ''}]);
    let query = "SELECT addresses.city, addresses.periferia FROM addresses WHERE id=" + pool.escape(id);
    pool.query(query, (err, result)=>{
        if(err)
            callback(err);
        else   
            callback(null, result);
    })
}
module.exports = {getPeriferies, getPoleis, getID, getAddress};