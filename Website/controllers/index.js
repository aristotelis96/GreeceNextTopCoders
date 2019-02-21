const db = require(appDir + '/models/categories.js');
const dbout = require(appDir + '/models/output.js');

const util = require('util');

module.exports = {
    getHomePage: async (req, res) => {
        var sess = req.session;
        req.session.login = false;
        if (sess.email) {
            req.session.login = true;
        }
        try {
            /* get categories from model */
            let categories = await (util.promisify(db.getCategories))();
            let products = await (util.promisify(dbout.getOut))({
                limit: 6
            });                      
            console.log(products);
            return res.render('index.ejs', {
                title: "GNTC",
                categories: categories,
                products: products,
                login: req.session.login,
                name: req.session.email
            });
        }
        catch (e) {
            return res.send(e.toString())
        }               
    }
}