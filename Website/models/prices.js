const util = require('util');
const pool = require('./index').getPool();
const dbTags = require('./tags.js');
InsertInPrices = function (fields, callback) {
    let vals = " VALUES(" + pool.escape(fields.price) + "," + pool.escape(fields.dateFrom) + "," + pool.escape(fields.dateTo) + "," + pool.escape(fields.productID) + "," + pool.escape(fields.shopID) + "," +pool.escape(fields.userID)+");";
    let query = "INSERT INTO prices (price, dateFrom, dateTo, productID, shopID, userID)" + vals;
    pool.query(query, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, result);
        }
    })
}

pricesOfUser = function (userId, callback){
    query = "select prices.price, shops.name as shopName, shops.id as shopID, products.name as productName, products.id as productid from prices inner join users inner join products inner join shops on prices.shopID=shops.id && prices.productID=products.id && prices.userID=users.id where users.id=" + pool.escape(userId);
    pool.query(query, (err, result)=> {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}
pricesOfShop = function(shopId,callback){
    query = "select prices.price as productPrice,products.id as productId, products.name as productName, prices.dateFrom as productDateFrom, prices.dateTo as productDateTo, products.description as productDescription, products.category as productCategory, products.withdrawn as productWithdrawn from prices inner join products on prices.productID=products.id && prices.shopID="+ pool.escape(shopId);
    pool.query(query, (err, result)=> {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    })
}
getPrice = function (fields, callback){
    query = "SELECT * FROM prices WHERE productID=" + pool.escape(fields.productID) + " AND shopID=" + pool.escape(fields.shopID) + " AND price=" + pool.escape(fields.price);
    if(fields.dateFrom != 'NULL' && fields.dateFrom != '' && fields.dateFrom != null){
        query += " AND dateFROM=" + pool.escape(fields.dateFrom);
    }
    if(fields.dateTo != 'NULL' && fields.dateTo != '' && fields.dateTo != null){
        query += " AND dateTo=" + pool.escape(fields.dateTo);
    }    
    console.log(query);
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else {
            return callback(null, result);
        }
    })
}

getPrices = async function (fields, callback) {
    query = "SELECT * FROM ("
    query += "SELECT prices.price, products.id AS productId, products.name AS productName, shops.id AS shopId, shops.name AS shopName, shops.address AS shopAddress, prices.dateFrom as dateFrom, prices.dateTo as dateTo ";
    if ((fields.geoDist != null && !(isNaN(fields.geoDist))) && (fields.geoLng != null && !(isNaN(fields.geoLng))) && (fields.geoLat != null && !(isNaN(fields.geoLat))))
        query += ", acos(sin(radians(" + fields.geoLat + "))*sin(radians(lat)) + cos(radians(" + fields.geoLat + "))*cos(radians(lat))*cos(radians(lng)-radians(" + fields.geoLng + "))) * 6371 As shopDist ";
    query += "FROM prices INNER JOIN products ON prices.productID = products.id INNER JOIN shops ON prices.shopId = shops.id ";
    query += "WHERE 1=1"
    if ((fields.geoDist != null && !(isNaN(fields.geoDist))) && (fields.geoLng != null && !(isNaN(fields.geoLng))) && (fields.geoLat != null && !(isNaN(fields.geoLat))))
        query += " AND acos(sin(radians(" + fields.geoLat + "))*sin(radians(lat)) + cos(radians(" + fields.geoLat + "))*cos(radians(lat))*cos(radians(lng)-radians(" + fields.geoLng + "))) * 6371 <" + fields.geoDist + " ";        
    if (fields.dateFrom != null && fields.dateTo != null)
        query += " AND ((prices.dateFrom <= " + pool.escape(fields.dateTo) + " AND prices.dateTo >=" + pool.escape(fields.dateFrom) + ") OR prices.dateTo = '0000-00-00')";
    if (fields.shops != null && fields.shops.length > 0) {
        query += " AND ("
        for(let i = 0; i<fields.shops.length; i++){
            query += " shops.id = " + fields.shops[i] + " OR";
        }
        query += " 0)";
    }
    if (fields.products != null && fields.products.length > 0) {
        query += " AND ("
        for(let i = 0; i<fields.products.length; i++){
            query += " products.id = " + fields.products[i] + " OR";
        }
        query += " 0)";
    }
    if (fields.tags != null && fields.tags.length > 0){
        query += " AND ((products.id IN (SELECT categorized_product.productID FROM categorized_product INNER JOIN tags ON tags.id = categorized_product.tagID WHERE ("
        for (let i = 0; i<fields.tags.length; i++){
            query += " tags.name =" + pool.escape(fields.tags[i]) + " OR";            
        }
        query += " 0))) || (shops.id IN (SELECT categorized_shop.shopID FROM categorized_shop INNER JOIN tags ON tags.id = categorized_shop.tagID WHERE (";
        for (let i = 0; i<fields.tags.length; i++){
            query += " tags.name =" + pool.escape(fields.tags[i]) + " OR";            
        }
        query += " 0))))"
    }
    query += ") AS Main JOIN (";
    query += "select selected_date as date from ";
    query += "(select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from "
    query += "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,"
    query += "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,"
    query += "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,"
    query += "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,"
    query += "(select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v "
    query += "where selected_date between " + pool.escape(fields.dateFrom) + " and " + pool.escape(fields.dateTo) + " ) AS dates "
    query += "ON dates.date >= Main.dateFrom && dates.date <= Main.dateTo ";
    if (fields.sort != null) {
        if(fields.sort.column == 'geoDist') 
            fields.sort.column = "Main.shopDist"
        if(fields.sort.column == 'date')
            fields.sort.column = "dates.date"
        query += " ORDER BY " + fields.sort.column + " " + fields.sort.AscDesc;
    }
    let promisify = util.promisify;
    try {
        let results = await (async () => {
            // need promises, util.promisify doesnt work with pool.qeury
            return new Promise((resolve, reject) => {
                pool.query(query, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                })
            })
        })();
        for (let i = 0; i<results.length; i++){
            results[i].shopTags = [];
            (await (promisify(dbTags.getShopTags))(results[i].shopId)).forEach(tag =>{
                results[i].shopTags.push(tag.name);
            });
            results[i].productTags = [];
            (await (promisify(dbTags.getProductsTags))(results[i].productId)).forEach(tag =>{
                results[i].shopTags.push(tag.name);
            });            
        }
        
        return callback(null, results);
    }
    catch(err){
        return callback(err);
    }
}

deletePrice = function (id, callback){
    query = "DELETE FROM prices WHERE id =" + id;
    pool.query(query, (err, result)=>{
        if(err){
            callback(err);
        }
        else {
            callback(null, result);
        }
    })
}
module.exports = { InsertInPrices, pricesOfUser, pricesOfShop, getPrice, getPrices, deletePrice};