const fs = require('fs');
const session = require('express-session');
const dbShops = require(appDir + '/models/shops.js')
const dbaddresses = require(appDir + '/models/addresses.js')
const dbusers = require(appDir + '/models/users.js')
shoppage = function (req, res) {
    var urlID = req.params;  // this gets the parameter from url   
    dbShops.returnExactShop({ id: urlID[0] }, (err, result) => {
        if (err)
            return res.status(666).send("Error in accesing Db\n" + err);
        if (result.length == 0)
            return res.redirect('/shopnotfound');
        dbaddresses.getAddress(result[0].id, (err, resultaddress) => {
            if (err)
                return res.status(666).send("Error in accesing Db for addresses\n" + err);
            dbusers.returnUserByID(result[0].userID, (err, resultuser) => {
                if (err)
                    return res.status(666).send("Error in accesing Db for users\n" + err);
                let usermail;
                if (resultuser.length == 0)
                    usermail = null;
                else
                    usermail = resultuser[0].email;
                let lang, lati;
                if (result[0].lat == null || result[0].lng == null) {
                    lang = 99999;
                    lati = lang;
                } else {
                    lang = result[0].lng;
                    lati = result[0].lat
                }
                res.render("shopPage.ejs", {
                    login: req.session.login,
                    title: "Σελίδα καταστήματος",
                    name: req.session.email,
                    shopname: result[0].name,
                    shopphone: result[0].phone,
                    shoplng: lang,
                    shoplat: lati,
                    shopuseremail: usermail,
                    shopcity: resultaddress[0].city,
                    shopperiferia: resultaddress[0].periferia
                })
            })

        })
    })

}
module.exports = { shoppage };