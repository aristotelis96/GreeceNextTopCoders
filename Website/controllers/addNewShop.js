
const dbUser = require(appDir + '/models/users');
const dbShop = require(appDir + '/models/shops');

addNewShopGET = function (req, res) {
    if (req.session.login == null || req.session.login == false) {
        return res.redirect('/login');
    }
    res.render('newShop.ejs', {
        login: true,
        name : req.session.email,
        title: 'Νέο κατάστημα'
    });
}

addNewShopPOST = function (req, res) {
    if(req.session.email == null || req.session.email == false){
        return res.redirect('/');
    }
    let emailInput = req.session.email;
    let shopName = req.body.shopName;    
    let phone = req.body.phone;
    let address = req.body.address;
    let lng = req.body.lng;
    let lat = req.body.lat;
    let tags = req.body.tags;
    if(!Array.isArray(tags) && tags!=undefined)
        tags = [tags]; // if only 1 tag is inserted, req.body.tags returns a string
    // make sure shop doesnt exist
    const util = require('util'); //use of util.promisify();
    async function checkAndInsert() {
        try {
            //make sure at least Shop name is provided (client also checks this)
            if (shopName == null || shopName == undefined)
                throw new Error('shopname is null!!');
            //check shop
            let shop = await (util.promisify(dbShop.returnExactShop))({
                name: shopName,
                phone: phone,
                lng: lng,
                lat: lat,
                address: address
            });
            if (shop.length > 0) {
                throw new Error('Shop already existing');
            }
            //check user
            let user = await (util.promisify(dbUser.returnUser))(emailInput);  
            user = user[0];
            await (util.promisify(dbShop.insertShop))({
                name: shopName,
                address: address,
                phone: phone,
                lng: lng,
                lat: lat,
                tags: tags,
                userID: user.id
            });
            res.redirect('/addproduct');
        }
        catch (e) {
            res.send(e.toString());
        }
    }
    checkAndInsert();
}
module.exports = {addNewShopGET, addNewShopPOST}