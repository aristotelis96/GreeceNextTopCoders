const dbShops = require(appDir + '/models/shops.js')
const dbprices = require(appDir + '/models/prices.js')
const dbusers = require(appDir + '/models/users.js')
const util = require('util');

shoppage = async function (req, res) {
    try {
        var id = req.params.id;  // this gets the parameter from url   
        if (isNaN(id)) {
            throw new Error('Invalid shop Id: ' + id); //check id is number
        }

        let shop = (await (util.promisify(dbShops.returnShopByID))(id))[0];
        
        if (shop == undefined)
            throw new Error('Shop with id: ' + id + ' not found');
            
        let products = (await (util.promisify(dbprices.pricesOfShop))(id));

        return res.render('shopPage.ejs', {
            login: req.session.login,
            title: "Σελίδα καταστήματος",
            name: req.session.email,
            shop: shop,
            products: products
        })
    }
    catch (e) {
        return res.status(500).send("Internal Server Error: " + e.toString());
    }
}
module.exports = { shoppage };