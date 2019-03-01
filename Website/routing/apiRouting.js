var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers/api';

//load controllers
const {checkFormat} = require(controllersDir + '/middlewares/checkFormat.js');
const {getShops, postShop, deleteShop, putShop, patchShop} = require(controllersDir + '/shops.js');
const {getProducts, postProducts, putProducts, patchProducts, deleteProducts} = require(controllersDir + '/products.js');
const {getPrices} = require(controllersDir + '/prices.js');
const login = require(controllersDir + '/login');
const authentication = require(controllersDir + '/middlewares/authentication');
//login - logout
router.post('/login', login.login);
router.post('/logout', login.logout);

//routing
router.get('*', checkFormat);
router.get('/shops', getShops);
router.post('/shops', authentication, postShop);
router.get('/shops/:id', getShops);
router.put('/shops/:id', authentication, putShop);
router.patch('/shops/:id', authentication, patchShop);
router.delete('/shops/:id', authentication, deleteShop);
//products 
router.get('/products', getProducts);
router.post('/products', authentication, postProducts);
router.get('/products/:id', getProducts);
router.put('/products/:id', authentication, putProducts);
router.patch('/products/:id', authentication, patchProducts);
router.delete('/products/:id', authentication, deleteProducts);

//prices
router.get('/prices', getPrices);

router.all('*', (req, res) => {return res.status(400).json({message: 'Bad Request'})})
module.exports = router;