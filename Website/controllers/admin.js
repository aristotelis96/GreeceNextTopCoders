const fs = require('fs');
const session = require('express-session');
const dbprod = require(appDir + '/models/products.js');
const db = require(appDir + '/models/users');
const dbShops = require(appDir + '/models/shops');
const dbprices = require(appDir + '/models/prices');
const util = require('util');
const dbStat = require(appDir + '/models/statistics.js');

adminPage= async function (req, res) { 
    var email = req.session.email;
    if (email != 'admin@admin') //CHANGE_THIS 
       return res.redirect('/');
    try{
        var user = (await (util.promisify(db.returnUser))(email))[0];
        var users = await(util.promisify(db.getAllUsers))();
        var stats = await(util.promisify(dbStat.getRowCounts))();
        return res.render('adminPage.ejs', {
            title: "Προφιλ διαχειριστή",
            user: user,
            users: users,
            statistics: stats, 
            login: req.session.login,
            name: req.session.email,
        }); 
    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}

adminDeleteUserget = async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var users = await(util.promisify(db.getAllUsers))();
        return res.render('adminPageDeleteUser.ejs',{
            title: "Διαγραφή Χρήστη",
            users: users,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}

adminDeleteUserpost = async function(req, res) {
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid user Id: ' + id); //check id is number
        }
        await (util.promisify(db.deleteUserbyId))(id);
        return res.redirect('/adminPage');

    }catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}

adminDeleteShopget = async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var shops = await (util.promisify(dbShops.getAllShops))({
            status: 'ALL',
            sort: { column: 'name', AscDesc: 'DESC' }
        });
        return res.render('adminPageDeleteShop.ejs',{
            title: "Διαχείριση Καταστημάτων",
            shops: shops,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }

}

adminDeleteShoppost = async function(req, res) {
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid shop Id: ' + id); //check id is number
        }
        await (util.promisify(dbShops.deleteShop))(id);
        return res.redirect('/adminPage');

    }catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        });
    }
}
adminDeleteProductget = async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var products = await (util.promisify(dbprod.getAllProducts))({
            status: 'ALL',
            sort: { column: 'name', AscDesc: 'DESC' }
        });
        return res.render('adminPageDeleteProduct.ejs',{
            title: "Επεξεργασία προφίλ",
            products: products,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }

}
adminDeleteProductpost = async function(req, res) {
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        await (util.promisify(dbprod.deleteProduct))(id);
        return res.redirect('/adminPage');

    }catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        });
    }
}

adminDeletePriceget = async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        var prices = await (util.promisify(dbprices.pricesOfProduct))(id);
        return res.render('adminPageDeletePrice.ejs',{
            title: "Επεξεργασία προφίλ",
            prices: prices,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}

adminDeletePricepost = async function(req, res) {
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        await (util.promisify(dbprices.deletePrice))(id);
        return res.redirect('/adminPage');

    }catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        });
    }
}
adminDeletePricegetuser = async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        var prices = await (util.promisify(dbprices.pricesOfUser))(id);
        return res.render('adminPageDeletePrice.ejs',{
            title: "Επεξεργασία προφίλ",
            prices: prices,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}

adminDeletePricegetshop =  async function(req, res){
    var email = req.session.email;
    if (email != 'admin@admin')
        return res.redirect('/');
    try{
        var id = req.params.id;
        if (isNaN(id)) {
            throw new Error('Invalid product Id: ' + id); //check id is number
        }
        var prices = await (util.promisify(dbprices.pricesOfShop))(id);
        prices.checked = 1; // name of prices on that specific model is diferent, marked var to check on front end
        return res.render('adminPageDeletePrice.ejs',{
            title: "Επεξεργασία προφίλ",
            prices: prices,
            login: req.session.login,
            name: req.session.email,
        });


    }
    catch(e){
        return res.render("ErrorPage.ejs", {
            login: req.session.login,
            name: req.session.email,
            title: 'Η Σελίδα δεν είναι διαθέσιμη',
            ErrorMessage: e.toString()
        })
    }
}
module.exports = {adminPage, adminDeleteUserget, adminDeleteUserpost, adminDeleteShopget, adminDeleteShoppost, adminDeleteProductget, adminDeleteProductpost, adminDeletePriceget, adminDeletePricepost, adminDeletePricegetuser, adminDeletePricegetshop}