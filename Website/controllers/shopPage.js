const fs = require('fs');
const session = require('express-session');
const dbShops = require(appDir + '/models/shops.js')
const dbprices = require(appDir + '/models/prices.js')
const dbusers = require(appDir + '/models/users.js')
shoppage = function (req, res) {
    (async () => {
        var sess = req.session;
        req.session.login = false;
        if (sess.email) {
            req.session.login = true;
        }
        try {
            var id = req.params.id;  // this gets the parameter from url   
            if (isNaN(id)) {
                throw new Error('Invalid shop Id: ' + id); //check id is number
            }
            const util = require('util');
            let shop = (await (util.promisify(dbShops.returnShopByID))(id))[0];
            if (shop == undefined)
                throw new Error('Shop with id: ' + id + ' not found');            
            if (shop.lat == null || shop.lng == null) {
                shop.lng = 99999;
                shop.lat = 99999;
            }
            let user = (await (util.promisify(dbusers.returnUserByID))(shop.userID))[0];
            let products = (await(util.promisify(dbprices.pricesOfShop))(id));
            
            
            //ToDo update view for address
            return res.render('shopPage.ejs', {
                login: req.session.login,
                title: "Σελίδα καταστήματος",
                name: req.session.email,
                shopname: shop.name,
                shopphone: shop.phone,
                shoplng: shop.lng,
                shoplat: shop.lat,
                shopuseremail: user.email,// not used
                shopaddress: shop.address, // controller only sends ONE shop.address and view displays
                productofshop : products
            })
        }
        catch (e) {
            return res.status(500).send("Internal Server Error: " + e.toString());
        }

    })(); return;
}
module.exports = { shoppage };