const fs = require('fs');
const bcrypt = require('bcrypt');
const jo = require('jpeg-autorotate');
const db = require(appDir + '/models/users');
const dbShop = require(appDir + '/models/shops');
const dbPrices = require(appDir + '/models/prices')
const util = require('util');

const saltRounds = 12;

module.exports = {
    deleteUser: (req, res) => {
        let email = req.query.user;
        //check if user is the one deleting
        if (email != req.session.email || email == undefined) {
            return res.redirect('/');
        }
        async function deleteAll() {
            let user = await (util.promisify(db.returnUser))(email);
            user = user[0];
            try {            
                await (util.promisify(fs.unlink))(`public/assets/profileImg/` + user.email + '.png')
            }
            catch (e) {
                /* Do nothing, image probably did not exist */ 
                //console.log(e);
            }
            try {
                await (util.promisify(db.deleteUser))(email);
            }
            catch (e) {
                res.send(e.toString());
            }
            return res.redirect('/logout');
        }
        deleteAll();
    },
    userPageget: (req, res) => {
        if (!req.session.email) {
            return res.redirect('/login');
        }
        var email = req.session.email;
        db.returnUser(email, (err, result) => {
            if (err) {
                return res.status(500).send("database error\n" + err);
            }
            if (result.length == 0) {
                return res.redirect('/');
            } 
            dbPrices.pricesOfUser(result[0].id, (err, prices) => {         // otan ginei to model tote 8a to kanoume (Y)
                if (err) {
                    return res.status(500).send('db error pricesofuser');
                } else {
                    UsrProducts = [];
                    for(let i=0; i<prices.length; i++){
                        UsrProducts.push({});
                        UsrProducts[i].productid = prices[i].productid;
                        UsrProducts[i].productName = prices[i].productName;
                        UsrProducts[i].price = prices[i].price;
                        UsrProducts[i].shopname = prices[i].shopName;
                        UsrProducts[i].shopid = prices[i].shopID;
                    }
                    res.render('userPage.ejs', {
                        title: "Επεξεργασία προφίλ",
                        user: result[0],
                        login: req.session.login,
                        name: req.session.email,
                        Usrproducts: UsrProducts
                    })
                }
            }) 
        })
    },
    userPagepost: (req, res) => {
        var password = req.body.password;
        var passwordconf = req.body.passwordconf;
        var image = req.files.image;
        var email = req.session.email;
        var uploadedFile;
        var image_name;        
        var newpassword;
        async function UpdateUser() {
            if (!req.session.email) {
                return res.redirect('/');
            }
            let user = await (util.promisify(db.returnUser))(email);
            user = user[0];
            if (req.files != undefined && req.files.image != null) {
                try {
                        await (util.promisify(fs.unlink))(`public/assets/profileImg/` + user.email + '.png');
                }
                catch (e) {
                    // console.log(e);
                }
                uploadedFile = image;
                image_name = uploadedFile.name;
                // check type. should be png or jpeg                
                if (!(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg')) {
                    return res.send('wrong image type');
                }
                // how the file will be stored (png regardless)
                image_name = user.email + '.png';
                uploadedFile.mv('public/assets/profileImg/' + image_name, (err) => {
                    if (err) {
                        return (err + " upload.mv failed");
                    }
                    // if it was jpeg fix exif orientation
                    if (uploadedFile.mimetype === 'image/jpeg') {
                        jo.rotate('./public/assets/profileImg/' + image_name, {}, function (err, buffer) {
                            if (err) {
                                //do nothing if rotate fails, just continue
                            }
                            var buf = new Buffer.from(buffer, 'binary');
                            fs.writeFile('./public/assets/profileImg/' + image_name, buf, function (err) {
                                if (err) {
                                    return console.error(err + ' could not save image on SignupPOST');
                                }
                            });
                        })
                    }
                });
            } 
            if (password != null && passwordconf != null && password != '' && passwordconf != '') {
                if (password == passwordconf && password.length >= 8) {
                    var EncryptedPass = bcrypt.hashSync(password, saltRounds);
                    newpassword = EncryptedPass;
                } else {
                    return res.send({
                        "code": 404,
                        "failed": "paswords dont match or password two small"
                    });
                }
            } else {
                newpassword = user.password;
            }
            db.updateUser({
                id: user.id,
                email: user.email,
                password: newpassword,
                name: user.name,
                surname: user.surname
            }, (err, result) => {
                if (err) {
                    return res.send(err);
                } else {
                    // if no error, return to userPage

                    return res.redirect('/userpage');
                }
            })
        }
        UpdateUser();
    }
};