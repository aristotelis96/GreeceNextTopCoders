var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers';

/* ------------- Load Controllers ---------- */
//home page
const {getHomePage} = require(controllersDir + '/index.js');
//user
const { deleteUser, userPageget, userPagepost } = require(controllersDir + '/users');
//login
const { login, logout, signupGET, signupPOST } = require(controllersDir + '/login');
const isLoggedIn = require(controllersDir + '/middlewares/isLoggedIn');
const { check_user } = require(controllersDir + '/AJAXrelated/check_user.js');
//add new Shop
const {addNewShopGET, addNewShopPOST} = require(controllersDir + '/addNewShop');
const {searchShop} = require(controllersDir + '/AJAXrelated/searchShop.js');
//shop page
const { shoppage } = require(controllersDir + '/shopPage.js')
//addresses
const addresses = require(controllersDir + '/AJAXrelated/addresses');
//add new product
const {addProduct} = require(controllersDir + '/products.js')
const {searchProduct} = require(controllersDir + '/AJAXrelated/searchProduct.js');
//get tags json for ajax request
const {getTags} = require(controllersDir + '/AJAXrelated/getTags.js');
//search for offers
const output = require(controllersDir + '/output.js');
const search = require(controllersDir +'/search.js');
//shop Item
const {getItem, postItem} = require(controllersDir + '/item.js')

const about = require(controllersDir + '/about.js');
const contact = require(controllersDir + '/contact.js')
//navbar middleware
const {navbarLogin} = require(controllersDir + '/middlewares/navbarLogin.js');
const {adminPage, adminDeleteUserget, adminDeleteUserpost, adminDeleteShopget, adminDeleteProductget, adminDeleteProductpost, adminDeletePriceget, adminDeletePricepost, adminDeletePricegetuser, adminDeletePricegetshop} = require(controllersDir + '/admin.js');

/* --------- ROUTING --------- */
//Navbar login from every page
router.all('/*', navbarLogin)

router.get('/', getHomePage);
//check if user is logged middleware
router.all('/login*', isLoggedIn);
//login pages
router.get('/login', login);
router.post('/login', login);
router.get('/login/signup', signupGET);
router.post('/login/signup', signupPOST);
router.get('/logout', logout);

router.get('/check_user/', check_user);
router.get('/delete/', deleteUser);
router.get('/userPage', userPageget);
router.post('/userPage', userPagepost);
//shop page 
router.get('/shopPage/:id',shoppage);
//item page
router.get('/item/:id',getItem);
router.post('/item/:id', postItem);
//Products 
router.get('/addproduct', addProduct);
router.post('/addproduct', addProduct);
router.get('/searchProduct', searchProduct);

//addresses points
router.get('/addresses/periferies', addresses.periferies);
router.get('/addresses/poleis', addresses.poleis);
//search 
router.get('/search', search);
router.post('/search/output', output);
//add Shop Page
router.get('/addNewShop', addNewShopGET);
router.post('/addNewShop', addNewShopPOST);
router.get('/getTags', getTags);
router.get('/searchShop', searchShop);
router.get('/about', about);
router.get('/contact', contact);
router.get('/adminPage', adminPage);
router.get('/adminPage/DeleteUser', adminDeleteUserget)
router.post('/adminPage/DeleteUser/:id',adminDeleteUserpost)
router.get('/adminPage/DeleteShop',adminDeleteShopget)
router.post('/adminPage/DeleteShop/:id',adminDeleteShoppost)
router.get('/adminPage/DeleteProduct', adminDeleteProductget )
router.post('/adminPage/DeleteProduct/:id',adminDeleteProductpost)
router.get('/adminPage/DeletePrice/products/:id',adminDeletePriceget)
router.get('/adminPage/DeletePrice/user/:id',adminDeletePricegetuser)
router.get('/adminPage/DeletePrice/shop/:id',adminDeletePricegetshop)
router.post('/adminPage/DeletePrice/:id',adminDeletePricepost)

//testing section
//router.get('/test', (req,res)=>{console.log(req.get('Referer'));res.redirect('back')});
//error page if all fails. This should always be last
router.get('*', function(req,res){
    res.render("ErrorPage.ejs",{
        login: req.session.login,
        name: req.session.email, 
        title: 'Ουψ',
        ErrorMessage: "Η σελίδα που ζήτησες δεν βρέθηκε!"
    });
});

module.exports = router;