const fs = require('fs');
const session = require('express-session');
const dbprod = require(appDir + '/models/products.js');
const dbtags = require(appDir + '/models/tags.js');
const util = require('util');

module.exports = item = async function(req,res){
    var product;
    var tags;
    let nd = req.body.newdescription;
    try {
        var id = req.params.id;  // this gets the parameter from url   
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        if (nd != undefined || nd !=''){
            let fields={description:nd, id:id};
            await(util.promisify(dbprod.addDById))(fields);
        }
        product = (await (util.promisify(dbprod.returnProductById))(id))[0];
        tags = (await (util.promisify(dbtags.getProductsTags))(id));
        result = (await (util.promisify(dbprod.returnOfferById))(id));
    }
    catch (e) {
        //in case of an error
        return res.send(e.toString());
    }
    res.render('shopItem.ejs',{
        login: req.session.login,
        name: req.session.email, 
        title: 'Σελίδα Προιόντος', 
        product: product,
        tags:tags,
        result:result
    })
}