
const dbProducts = require(appDir + '/models/products.js');
const dbCategories = require(appDir + '/models/categories.js')
const dbShop = require(appDir + '/models/shops.js');
const dbPrices = require(appDir + '/models/prices.js');

const util = require('util');
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
                return res.redirect('/');
            let user = req.session.userid;                            
            let priceInput = req.body.priceInput; //price
            let startdateInput = req.body.startdate;
            let enddateInput = req.body.enddate;
            let checkstartInput = req.body.start;    // check if date is given 
            let checkendInput = req.body.end;       // check if date is given
            
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
            
            /* Get company id */
            let shopId = req.body.companyInput;
 
            async function checkAndInsert() {
                try {
                    /* Check if user is adding a new product. If yes, add the new product */
                    let newProductFlag = req.body.newProductFlag;
                    let productId; /* Declaretion of productId, will be used for prices entry */
                    if(newProductFlag == "true"){
                        /* Get all parameters */
                        let name = req.body.productName;
                        if(name==""){
                            throw new Error('Empty name for new Product!');
                        }
                        let category = req.body.categoryInput;
                        let description = req.body.decriptionInput;                        
                        let extraData = req.body.extraData;
                        let tags = req.body.tags;
                        if (!Array.isArray(tags) && tags != undefined)
                            tags = [tags];  // if only 1 tag is inserted, req.body.tags returns a just a string, but we need array
                        /* Insert new product and get ID */
                        productId = await (util.promisify(dbProducts.InsertInProducts))({
                            name: name,
                            description: description,
                            category: category,
                            tags: tags,
                            extraData: extraData
                        })
                        productId = productId.insertId;
                    } else if (newProductFlag == "false"){
                        /* else user selected from list and we have a productId from front end */
                        productId = req.body.productId                     
                        if(isNaN(productId))
                            throw new Error("productId NaN..???"); //Unreachable, unless someone tweeks front end
                        /* Make sure Id is inside db */
                        
                    } else {
                        throw new Error("newProductFlag hidden input was neither 'true' nor 'false'");
                    }
                    
                    /* Find shop */                
                    var shop = await (util.promisify(dbShop.returnShopByID))(shopId);
                    if (shop.length == 0)
                        throw new Error('Shop does not exist'); // Unreachable, unless someone tweeks front end
                    /* insert price */                
                    await (util.promisify(dbPrices.InsertInPrices))({
                        price: priceInput,
                        dateFrom: startdateInput,
                        dateTo: enddateInput,
                        productID: productId,
                        userID: user,
                        shopID: shop[0].id          //ToDO. Maybe (?) Update price for multiple shops
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