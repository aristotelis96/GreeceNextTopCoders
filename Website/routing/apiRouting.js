var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers/api';

//load controllers
const {getShops} = require(controllersDir + '/shops.js');

//routing
router.get('/shops', getShops);
module.exports = router;