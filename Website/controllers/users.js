const fs = require('fs');
const db = require(appDir + '/models/users');
const dbShop = require(appDir + '/models/shops');
module.exports = {
    deleteUser: (req, res) => {
        let email = req.query.user;
        //check if user is the one deleting
        if(email != req.session.email || email== undefined){
            return res.redirect('/');
        }
        async function deleteAll(){
            const util = require('util');
            let user = await (util.promisify(db.returnUser))(email);
            user = user[0];
            try{
                if(user.image != 'anonymous.png')
                    await (util.promisify(fs.unlink))(`public/assets/profileImg/` + user.image)
            } 
            catch(e){
                console.log(e);
            }
            try{
                await (util.promisify(db.deleteUser))(email);
            }
            catch(e){
                res.send(e.toString());
            }
            return res.redirect('/logout');
        }
        deleteAll();
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