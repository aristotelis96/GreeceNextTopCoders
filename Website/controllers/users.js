const fs = require('fs');
const db = require(appDir + '/models/users');
const dbShop = require(appDir + '/models/shops');
module.exports = {
    deleteUser: (req, res) => {
        let email = req.query.user;
        //check if user is the one deleting
        if (email != req.session.email || email == undefined) {
            return res.redirect('/');
        }
        async function deleteAll() {
            const util = require('util');
            let user = await (util.promisify(db.returnUser))(email);
            user = user[0];
            try {
                if (user.image != 'anonymous.png')
                    await (util.promisify(fs.unlink))(`public/assets/profileImg/` + user.image)
            }
            catch (e) {
                console.log(e);
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
            return res.redirect('/');
        }
        var email = req.session.email;
        db.returnUser(email, (err, result) => {
            if (err) {
                return res.status(500).send("database error\n" + err);
            }
            if (result.length == 0) {
                return res.redirect('/');
            }
            res.render('userPage.ejs', {
                title: "Επεξεργασία προφίλ",
                user: result[0],
                login: req.session.login,
                name: req.session.email
            })
        })
    },
    userPagepost: (req, res) => {
        var password = req.body.password;
        var passwordconf = req.body.passwordconf;
        var image = req.body.image;
        var email = req.session.email;
        var uploadedFile;
        var image_name;
        var fileExtension;
        var newimage;
        var newpassword;
        async function UpdateUser() {
            if (!req.session.email) {
                return res.redirect('/');
            }
            let user = await (util.promisify(db.returnUser))(email);
            user = user[0];
            if (req.files != undefined && req.files.image != null) {
                try {
                    if (user.image != 'anonymous.png') {
                        await (util.promisify(fs.unlink))(`public/assets/profileImg/` + email + '.png')
                        await (util.promisify(fs.unlink))(`public/assets/profileImg/` + email + '.jpeg')
                    }
                }
                catch (e) {
                    // console.log(e);
                }
                uploadedFile = req.files.image;
                image_name = uploadedFile.name;
                // check type. should be png or jpeg
                fileExtension = uploadedFile.mimetype.split('/')[1];
                if (!(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg')) {
                    return res.send('wrong image type');
                }
                // how the file will be stored
                image_name = emailInput + '.' + fileExtension;
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
                newimage = image.name;
            } else {
                newimage = user.image;
            }
            if (password != null && passwordconf != null) {
                if (password == passwordconf) {
                    var EncryptedPass = bcrypt.hashSync(password, saltRounds);
                    newpassword = EncryptedPass;
                } else {
                    return res.send({
                        "code": 404,
                        "failed": "paswords dont match"
                    });
                }
            } else {
                newpassword = user.password ;
            }
            db.updateuser({
                id: user.id,
                email: user.email,
                password: newpassword,
                image: newimage,
                name: user.name,
                surname: user.surname
            }, (err,result)=> {
                if (err) {
                    return res.send(err);
                } else {
                    // if no error, return to home page logged in
                   
                    return res.redirect('/userpage');
                }
            })
        }
    }
};