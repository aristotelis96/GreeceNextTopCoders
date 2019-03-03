const fs = require('fs');
const session = require('express-session');
const dbprod = require(appDir + '/models/products.js');
const db = require(appDir + '/models/users');
const dbShops = require(appDir + '/models/shops');
const util = require('util');

adminPage= async function (req, res) { 
    var email = req.session.email;
    if (email != 'admin@admin') //CHANGE_THIS 
       return res.redirect('/');
    try{
        var user = (await (util.promisify(db.returnUser))(email))[0];
        return res.render('adminPage.ejs', {
            title: "Προφιλ διαχειριστή",
            user: user,
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
            title: "Επεξεργασία προφίλ",
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
            throw new Error('Invalid user Id: ' + id); //check id is number
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

module.exports = {adminPage, adminDeleteUserget, adminDeleteUserpost, adminDeleteShopget, adminDeleteShoppost}