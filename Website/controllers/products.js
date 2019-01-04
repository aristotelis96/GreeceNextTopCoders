const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jo = require('jpeg-autorotate');
const dbProducts = require(appDir + '/models/products.js'); 
const dbShops = require(appDir + '/models/shops.js')
const saltRounds = 12;

module.exports = {
    addProduct: (req, res) => {
        if (req.method == "GET") {
            var sess = req.session;
            if( req.session.email)
                req.session.login = true;
            else 
                req.session.login = false; 
                dbProducts.getAllProducts((err, result) => {   
                    dbShops.getAllShops((err1, result1) => {
            res.render("addproduct.ejs", {
                login: req.session.login,
                title: "Πρόσθεσε προϊόν",
                name: req.session.email,
                products: result,
                shops: result1
            })
        })
        })
        }else if ( req.method == "POST"){
            let productInput = req.body.productInput; // inputed values
            let companyInput = req.body.companyInput; // use them to do 
            let decriptionInput = req.body.decriptionInput;
            let priceInput= req.body.priceInput;
            let categoryInput= req.body.categoryInput;
            let startdateInput= req.body.startdate;
            let enddateInput= req.body.enddate;
            let checkstartInput = req.body.start;
            let checkendInput = req.body.end;

            if (checkendInput == "on" && checkstartInput == "on"){

            }else if (checkstartInput == "on"){
                
            }else if (checkendInput == "on"){

            }else { 

            }
        }

    }
}