const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dbout = require(appDir + '/models/output.js');
const util = require('util');

module.exports = output = async function(req,res){
    let ccheck = req.body.check;        
    let from = req.body.from;
    let to = req.body.to;
    let search = req.body.search;  
    let searchFor = req.body.searchFor;       
    let geolocation = req.body.geoLocationFlag;
    if (geolocation != undefined) {
        var positionLng = req.body.positionLng;
        var positionLat = req.body.positionLat;
        var distance = req.body.distance;
    }
    if (!Array.isArray(search) && search != undefined)
        search = [search];
    var results;    
    try  {  
         results = await (util.promisify(dbout.getOut))({   
                searchString: search, 
                ccheck: ccheck,
                priceFrom: from,
                priceTo: to,
                search: search,
                searchFor: searchFor,
                positionLat: positionLat,
                positionLng: positionLng,
                distance: distance,
                limit: 50
        })
    }
    catch (e) {
        return res.send(e.toString())
    }
    res.render('output.ejs',{
        login: req.session.login,
        name: req.session.email, 
        title: 'Δες τι βρήκαμε για σένα!', 
        result:results
    })
}
