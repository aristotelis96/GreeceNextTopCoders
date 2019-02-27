var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers/api';

//load controllers
const {checkFormat} = require(controllersDir + '/middlewares/checkFormat.js');
const {getShops, postShop, deleteShop, putShop} = require(controllersDir + '/shops.js');
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
router.put('/shops/:id', putShop);
router.delete('/shops/:id', authentication, deleteShop);

router.all('*', (req, res) => {return res.status(400).json({message: 'Bad Request'})})
module.exports = router;