var express = require('express');
var router = express.Router();

var controllersDir = appDir + '/controllers/api';

//load controllers
const {checkFormat} = require(controllersDir + '/middlewares/checkFormat.js');
const {getShops} = require(controllersDir + '/shops.js');

//routing
router.get('*', checkFormat);
router.get('/shops', getShops);
router.get('/shops/:id', getShops);

router.all('*', (req, res) => {return res.status(400).send('Bad Request')})
module.exports = router;