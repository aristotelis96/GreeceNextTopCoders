const pool = require('./index').getPool();

getAllShops = function (callback) {
    let query = "SELECT * FROM `shops`;";
    pool.query(query, (err, result) => {
        if (err) {
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
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}
returnExactShop = function (fields, callback) {
    let query = "SELECT * FROM shops WHERE name = " + pool.escape(fields.name);
    if(fields.phone!=null)
        query += " && phone=" + pool.escape(fields.phone);
    
    if(fields.lng != null)
        query += " && lng=" + pool.escape(fields.lng);
    if(fields.lat != null)
        query += " && lat=" + pool.escape(fields.lat);
    if(fields.periferia != null && fields.city != null)
        query += " && addressID= (SELECT id FROM addresses WHERE periferia=" + pool.escape(fields.periferia) + " && city=" + pool.escape(fields.city) + ")";
    pool.query(query, (err, results) => {
        if (err) {
            return callback(err);
        }
        else {
            return callback(null, results);
        }
    })
}
insertShop = function (fields, callback) {
    let query_sets = "INSERT INTO `website`.`shops` (name";
    let query_vals = "VALUES(" + pool.escape(fields.name);
    if(fields.periferia != null && fields.poli!=null){
        query_sets += ", addressID";
        query_vals += ", (SELECT id FROM addresses WHERE periferia=" +pool.escape(fields.periferia)+"&& city="+pool.escape(fields.poli)+")"
    }
    if(fields.phone!=''){
        query_sets += ", phone";
        query_vals += "," +pool.escape(fields.phone);
    }
    if(fields.lng!='' && fields.lat!=''){
        query_sets += ",lng,lat";
        query_vals += ","+ pool.escape(fields.lng) + "," +pool.escape(fields.lat);
    }
    query_sets += ")";
    query_vals += ");";
    let query = query_sets+query_vals;
    console.log(query);
    pool.query(query, (err, result)=>{
        if(err){
            return callback(err);
        } else{
            return callback(null, result);
        }
    })
}
deleteShop = function (id, callback){
    let query = "DELETE FROM shops WHERE id=" + pool.escape(id);
    pool.query(query, (err, result)=>{
        if(err){
            return callback(err);
        } else{
            return callback(null, result);
        }
    })
}
module.exports = { getAllShops, returnShop, insertShop, returnExactShop, deleteShop};