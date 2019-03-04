// Get pool connection from Index
const pool = require('./index').getPool();

getOut = function (fields, callback) {
    let query = "SELECT shops.name as 'shopName', shops.id as 'shopId', products.id, products.name, products.description, prices.price, prices.dateFrom, prices.dateTo FROM shops, prices, products WHERE (shops.id = prices.shopID AND prices.productID = products.id)";
    if (fields.ccheck!= undefined && fields.ccheck != []){
        query += " AND ("
        for (let i=0; i<fields.ccheck.length; i++){
            if (i!=0) 
                query += " OR ";            
            query += "products.category = " + pool.escape(fields.ccheck[i]);
        }
        /* An exei epilexthei kai to "allo" prepei na fairoume kai osa proionta den anoikoun se kamia apo tis gnostes katigories */            
        if (fields.ccheck.indexOf("Άλλο") != -1){
            query += " OR products.category NOT IN (select * from categories)" 
        }
        query += ")";
    }
    if (fields.searchString != null && fields.searchString != ''){
        if(fields.searchFor != undefined){        
            if(fields.searchFor.includes('products'))
                query += " AND products.name LIKE CONCAT('%'," + pool.escape(fields.searchString) + ",'%')";
            if(fields.searchFor.includes('shops'))
                query += " AND shops.name LIKE CONCAT('%'," + pool.escape(fields.searchString) + ",'%')";
            if(fields.searchFor.includes('tags')){        
                let tags = fields.searchString[0].split(" ");                
                query += " AND products.id IN (SELECT categorized_product.productID FROM categorized_product INNER JOIN tags ON tags.id=categorized_product.tagID WHERE "
                tags.forEach(i => {
                    query += " tags.name LIKE CONCAT('%'," + pool.escape(i) + ",'%') OR ";
                })
                query += "0)"
            }
        }
    }
    if(fields.withdrawn != null)
        query += " AND products.withdrawn =" + pool.escape(fields.withdrawn) + " AND shops.withdrawn=" + pool.escape(fields.withdrawn)
    else   
        query += " AND products.withdrawn =false AND shops.withdrawn=false";
        
    if (fields.priceFrom != null && fields.priceFrom != '')
        query += " AND prices.price >= " + fields.priceFrom;
    if (fields.priceTo != null && fields.priceTo != '')
        query += " AND prices.price <= " + fields.priceTo;   
    if (fields.positionLng != null && fields.positionLat != null && fields.distance != null){
        query += " AND acos(sin(radians(" + fields.positionLat + "))*sin(radians(lat)) + cos(radians(" + fields.positionLat + "))*cos(radians(lat))*cos(radians(lng)-radians(" + fields.positionLng + "))) * 6371 <" + fields.distance;        
    }    
    /* Make sure results are not expired */
    let today = new Date();
    today = today.getFullYear() + "-" + ("0" + (today.getMonth()+1)).slice(-2) + "-" + ("0" + (today.getDate())).slice(-2);    
    query += " AND (prices.dateTo > " + pool.escape(today) + " OR prices.dateTo='0000-00-00')";
    if (fields.limit!= null){
        query += " LIMIT " + fields.limit;
    }    
    pool.query(query, (err, result) => {
        if(err){
            return callback(err);
        }
        else{
            return callback(null, result);
        }
    }); 
}

module.exports = {getOut};