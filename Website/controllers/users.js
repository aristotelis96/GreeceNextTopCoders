const fs = require('fs');
const db = require(appDir + '/models/users');
module.exports = {
    deleteUser: (req, res) => {
        let email = req.query.user;
        //check if user is the one deleting
        if(email != req.session.email || email== undefined){
            return res.redirect('/');
        }
        

        db.returnUser(email, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            let image = result[0].image;
            if (image != 'anonymous.png') {
                fs.unlink(`public/assets/profileImg/` + image, (err) => {
                    if (err) {
                        return console.error(err, 'could not delete profile Image');
                    }
                });
            }
            db.deleteUser(email, (err, result) => {
                if (err) {
                    console.error(err, 'delete user database query error');
                    return res.status(500).send(err);
                }
                return res.redirect('/logout');
            });
        });
    },
    userPage: (req, res) => {
        if(!req.session.email){
            return res.redirect('/');
        }
        var email = req.session.email;
        db.returnUser(email, (err,result) =>{
            if(err){
                return res.status(500).send("database error\n" + err);
            }
            if(result.length==0){
                return res.redirect('/');
            }
            res.render('userPage.ejs',{
                title: "Επεξεργασία προφίλ",
                user: result[0],
                login: req.session.login,
                name: req.session.email
            })
        })
    }
};