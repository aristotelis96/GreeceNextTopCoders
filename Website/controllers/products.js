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
            let checkstartInput = req.body.start;    // check if date is given 
            let checkendInput = req.body.end;

            if (checkendInput == "on" && checkstartInput == "on"){
                //do nothing ? 
            }else if (checkstartInput == "on"){
                enddateInput = "NULL";
            }else if (checkendInput == "on"){
                startdateInput = "NULL";            // if no date given, put null
            }else { 
                startdateInput = "NULL";
                enddateInput = "NULL";
            }
            //check if product exists from an other store
            //if not, add it first, else just get the id 
            //then add price and store to the other table
            dbProducts.returnProduct(productInput, function ( error, results, field){
                if (error){
                    return res.send({
                        "code": 404,
                        "failed": "error while accesing db"
                    });
                }else {
                    if (!(results.length > 0)){ //if  not existing in db,insert
                        dbProducts.InsertInProducts({
                            name : productInput,
                            description : decriptionInput,
                            category : categoryInput
                        }, (err, ress)=>{
                            if (err)
                            return res.send(err);
                        }); // now it sure is in db, get the id 
                    }
                    dbProducts.returnShopID(companyInput, function( shopError,resultShop,shopFields){
                        if (shopError){
                            return res.send({
                                "code": 4004,
                                "failed": "error while accesing db for shop id"
                            });
                        }
                    else{
                    dbProducts.returnProductID(productInput, function( errorr,resultProduct,fields){
                        if (errorr){
                            return res.send({
                                "code": 4004,
                                "failed": "error while accesing db for product id"
                            });
                        }else { // now we got the id in result(???), inster in table prices
                            console.log(resultProduct);
                            dbProducts.InsertInPrices({
                                price: priceInput,
                                dateFrom: startdateInput,
                                dateTo: enddateInput,
                                productID: resultProduct,              // edw paraponietai,"a foreign key constraint fails"
                                shopID: resultShop
                            },(insertError,InsertResult) =>{
                                if(insertError)                // pray for no errors....
                                    return res.send(insertError);
                                else{
                                    var sess = req.session; // if all is good, go to home page
                                    sess.email = emailInput;
                                    return res.redirect('/');
                                }
                            })
                        }
                    })
                }
                })


                }
            })

        }

    }
}