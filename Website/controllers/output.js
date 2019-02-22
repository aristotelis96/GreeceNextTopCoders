const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dbout = require(appDir + '/models/output.js');
const util = require('util');

module.exports = output = async function(req,res){
    //results = [{shop: 'A', product:'AA', price: 1},{shop: 'B', product:'BB', price:2}]
    let ccheck = req.body.check;        
    let from = req.body.from;
    let to = req.body.to;
    let search = req.body.search;                       
    if (!Array.isArray(search) && search != undefined)
        search = [search];
    var results;    
    try  {  
         results = await (util.promisify(dbout.getOut))({    
                ccheck: ccheck,
                from: from,
                to: to,
                search: search
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
