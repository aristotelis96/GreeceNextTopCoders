var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers';

// load controllers
const {getHomePage} = require(controllersDir + '/index.js');
const { deleteUser, userPage } = require(controllersDir + '/users');
const { login, logout, signupGET, signupPOST } = require(controllersDir + '/login');
const isLoggedIn = require(controllersDir + '/middlewares/isLoggedIn');
const { check_user } = require(controllersDir + '/AJAXrelated/check_user.js');
const {searchShop} = require(controllersDir + '/searchShop.js');
const {addProduct} = require(controllersDir + '/products.js')
const {newShopGET, newShopPOST} = require(controllersDir + '/addNewShop');
//addresses
const addresses = require(controllersDir + '/AJAXrelated/addresses');


//routing
router.get('/', getHomePage);

router.get('/check_user/', check_user);
router.get('/searchShop', searchShop);

router.get('/delete/', deleteUser);
router.get('/userPage', userPage);

//check if user is logged middleware
router.all('/login*', isLoggedIn);
//Products 
router.get('/addproduct', addProduct);
router.post('/addproduct', addProduct);
//login pages
router.get('/login', login);
router.post('/login', login);
router.get('/login/signup', signupGET);
router.post('/login/signup', signupPOST);
router.get('/logout', logout);
//addresses points
router.get('/addresses/periferies', addresses.periferies);
router.get('/addresses/poleis', addresses.poleis);

//add Shop Page
router.get('/addNewShop', addNewShopGET);
router.post('/addNewShop', addNewShopPOST);
//testing section
//router.get('/test', testModule);

//error page if all fails. This should always be last
router.get('*', function(req,res){
    res.send("<html><body><h1>Η σελίδα δεν βρέθηκε</h1><h2>Κάνε κλικ <a href='/'>εδώ</a> για να μεταφερθείς στην αρχική σελίδα</h2></body></html>");
});

module.exports = router;