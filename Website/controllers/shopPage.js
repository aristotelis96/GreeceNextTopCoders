const fs = require('fs');
const session = require('express-session');
const dbShops = require(appDir + '/models/shops.js')
const dbaddresses = require(appDir + '/models/addresses.js')
const dbusers = require(appDir + '/models/users.js')
shoppage = function (req, res) {
    (async () => {
        try {
            var id = req.params.id;  // this gets the parameter from url   
            if (isNaN(id)) {
                throw new Error('Invalid shop Id: ' + id); //check id is number
            }
            const util = require('util');
            let shop = (await (util.promisify(dbShops.returnExactShop))({ id: id }))[0];
            if (shop == undefined)
                throw new Error('Shop with id: ' + id + ' not found');            
            if (shop.lat == null || shop.lng == null) {
                shop.lng = 99999;
                shop.lat = 99999;
            }
            let user = (await (util.promisify(dbusers.returnUserByID))(shop.userID))[0];
            //ToDo update view for address
            return res.render('shopPage.ejs', {
                login: req.session.login,
                title: "Σελίδα καταστήματος",
                name: req.session.email,
                shopname: shop.name,
                shopphone: shop.phone,
                shoplng: shop.lng,
                shoplat: shop.lat,
                shopuseremail: user.email,
                shopcity: shop.address, // controller only sends ONE shop.address and view displays
                shopperiferia: shop.address
            })
        }
        catch (e) {
            return res.status(500).send("Internal Server Error: " + e.toString());
        }

    })(); return;
}
module.exports = { shoppage };