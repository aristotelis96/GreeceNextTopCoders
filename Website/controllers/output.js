const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const dbout = require(appDir + '/models/output.js');

module.exports = output = async function(req,res){
    //results = [{shop: 'A', product:'AA', price: 1},{shop: 'B', product:'BB', price:2}]
    let cnear = req.body.near;
    let cfood = req.body.food;
    let ccinema = req.body.cinema;
    let cmusic = req.body.music;
    let ctheater = req.body.theater;
    let ctransport = req.body.transport;
    let ccafe = req.body.cafe;
    let from = req.body.from;
    let to = req.body.to;
    let search = req.body.search;
    let category = "";
    if (cnear == "on") 
         category += "near" ;
    if (cfood == "on") {
        if (category != "")
            category += "OR" 
        category += "food";
    }
    if (ccinema == "on") {
        if (category != "")
            category += "OR" 
        category += "cinema";
    }   
    if (cmusic == "on"){
        if (category != "")
            category += "OR"  
        category += "music";
    }
    if (ctheater == "on"){
        if (category != "")
            category += "OR"  
        category += "theater";
    }
    if (ctransport == "on"){
        if (category != "")
            category += "OR"  
        category += "transport";
    }
    if (ccafe == "on"){
        if (category != "")
            category += "OR"  
        category += "cafe OR bar OR club";
    }                         
    if (!Array.isArray(search) && search != undefined)
        search = [search];
        try  {  
            var results = await (util.promisify(dbout.getOut)) ({    
                categories: category,
                from: from,
                to: to,
                search: search
        })
    }
    catch (e) {
        // console.log(e);
    }
    res.render('output.ejs',{
        login: req.session.login,
        name: req.session.email, 
        title: 'Δες τι βρήκαμε για σένα!', 
        results:results
    })
}
