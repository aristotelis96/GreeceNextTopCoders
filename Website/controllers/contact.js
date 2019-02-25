const fs = require('fs');
const session = require('express-session');

contact = async function(req,res){
    res.render('contact.ejs',{
        login: req.session.login,
        name: req.session.email, 
        title: 'Επικοινώνισε μαζί μας!', 
    })
}

module.exports = contact