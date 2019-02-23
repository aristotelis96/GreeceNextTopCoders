const fs = require('fs');
const session = require('express-session');

about = async function(req,res){
    res.render('about.ejs',{
        login: req.session.login,
        name: req.session.email, 
        title: 'Mάθε για μας!', 
    })
}

module.exports = about