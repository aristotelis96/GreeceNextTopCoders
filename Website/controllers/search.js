const promisify = require('util').promisify;
const dbCategories = require(appDir + '/models/categories.js');

module.exports = search = async function(req,res){
    var sess = req.session;
        req.session.login = false;
        if (sess.email) {
            req.session.login = true;
        }
    let categories = await promisify(dbCategories.getCategories)();
    res.render('search.ejs',{
        login: req.session.login,
        name: req.session.email,
        title: 'Ψάξε ψάξε!',
        categories: categories
    })
}