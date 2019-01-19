
const dbProducts = require(appDir + '/models/products.js');
const dbCategories = require(appDir + '/models/categories.js')

module.exports = {
    addProduct: async (req, res) => {
        if (req.method == "GET") {
            var sess = req.session;
            if (req.session.email)
                req.session.login = true;
            else
                req.session.login = false;
            const util = require('util');
            try {
                var products = await (util.promisify(dbProducts.getAllProducts))();
                var categories = await (util.promisify(dbCategories.getCategories))();

            } catch (e){
                return res.status(500).send('internal server error' + e.toString());
            }
            return res.render("addproduct.ejs", {
                login: req.session.login,
                title: "Πρόσθεσε προϊόν",
                name: req.session.email,
                products: products,
                categories: categories
            })


        } else if (req.method == "POST") {
            if(req.session.email == undefined)
                res.redirect('/');
            let user = req.session.userid;
            let productInput = req.body.productInput; // inputed values
            let shopId = req.body.companyInput; // use them to do 
            let decriptionInput = req.body.decriptionInput;
            let priceInput = req.body.priceInput;
            let categoryInput = req.body.categoryInput;
            let startdateInput = req.body.startdate;
            let enddateInput = req.body.enddate;
            let checkstartInput = req.body.start;    // check if date is given 
            let checkendInput = req.body.end;
            let tags = req.body.tags;
            if (!Array.isArray(tags) && tags != undefined)
                tags = [tags];  // if only 1 tag is inserted, req.body.tags returns a string

            if (checkendInput == "on" && checkstartInput == "on") {
                //do nothing ? 
            } else if (checkstartInput == "on") {
                enddateInput = "NULL";
            } else if (checkendInput == "on") {
                startdateInput = "NULL";            // if no date given, put null
            } else {
                startdateInput = "NULL";
                enddateInput = "NULL";
            }
            //check if product exists from an other store
            //if not, add it first, else just get the id 
            //then add price and store to the other table
            const util = require('util');
            async function checkAndInsert() {
                try {
                    //check if product exists
                    var result = await (util.promisify(dbProducts.returnProduct))(productInput);
                    if (result.length == 0) {
                        // if not insert product
                        productInput = await (util.promisify(dbProducts.InsertInProducts))({
                            name: productInput,
                            description: decriptionInput,
                            category: categoryInput,
                            tags: tags
                        })
                        //get id of new added product
                        productInput = productInput.insertId;
                    } else {
                        //else use existing product id
                        productInput = result[0].id;
                    }
                    //find shop
                    const dbShop = require(appDir + '/models/shops.js');
                    var shop = await (util.promisify(dbShop.returnShopByID))(shopId);
                    if (shop.length == 0)
                        throw new Error('Shop does not exist');
                    //insert price
                    const dbPrices = require(appDir + '/models/prices.js');
                    await (util.promisify(dbPrices.InsertInPrices))({
                        price: priceInput,
                        dateFrom: startdateInput,
                        dateTo: enddateInput,
                        productID: productInput,
                        userID: user,
                        shopID: shop[0].id          //ToDO. Maybe (?) Update price for all matching shops with given name
                    })
                }
                catch (e) {
                    //in case of an error
                    return res.send(e.toString());
                }
                return res.redirect('/');
            }
            return checkAndInsert();
        }

    }
}