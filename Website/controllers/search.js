const promisify = require('util').promisify;
const dbCategories = require(appDir + '/models/categories.js');

module.exports = search = async function(req,res){
    let categories = await promisify(dbCategories.getCategories)();
    res.render('search.ejs',{
        login: req.session.login,
        name: req.session.email,
        title: 'Ψάξε ψάξε!',
        categories: categories
    })
}