const fs = require('fs');
const session = require('express-session');
const dbShops = require(appDir + '/models/shops.js')
const dbaddresses = require(appDir + '/models/addresses.js')
shoppage = function (req, res) {
    var urlID = req.params;  // this gets the parameter from url
    console.log(urlID[0])
    dbShops.returnExactShop( {id: urlID[0]} , (err, result) => {
        console.log(result)
        if (err)
            return res.status(666).send("Error in accesing Db\n" + err);
        if (result.length == 0)
            return res.redirect('/shopnotfound');
        dbaddresses.getAddress(result[0].id, (err, resultaddress) =>{
            if (err)
            return res.status(666).send("Error in accesing Db for addresses\n" + err);
            console.log(result[0].id);
            console.log(resultaddress[0].city);
            console.log(resultaddress[0].periferia);
            res.render("shopPage.ejs",{
                login: req.session.login,
                title: "Σελίδα καταστήματος",
                name: req.session.email,
                shopname: result[0].name,
                shopphone: result[0].phone,
                shoplng: result[0].lng,
                shoplat:result[0].lat,
                shopuserID: result[0].userID,
                shopcity: resultaddress[0].city,
                shopperiferia: resultaddress[0].periferia             
            })
        })
    })

}
module.exports = { shoppage };