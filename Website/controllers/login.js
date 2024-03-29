const fs = require('fs');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jo = require('jpeg-autorotate');
const dbUser = require(appDir + '/models/users');
const dbShop = require(appDir + '/models/shops');
const saltRounds = 12;
module.exports = {
    login: function (req, res) {
        if (req.method == "GET") {
            res.render("login.ejs", {
                login: false, //not logged in
                title: "Είσοδος",
                message: "" //possible error message
            })
        } else if (req.method == "POST") {
            var emailInput = req.body.emailInput;
            var password = req.body.passwordInput;
            var url = req.body.url;
            
            url = url.replace("https://" + req.headers['host'], '')
            
            if (url == '' || url == '/search/output')
            url ='/';
            
            dbUser.returnUser(emailInput, function (error, results) {
                if (error) {
                    console.error("error ocurred in database during Login", error);
                    return res.render("ErrorPage.ejs", {
                        login: req.session.login,
                        name: req.session.email,
                        title: 'Η Σελίδα δεν είναι διαθέσιμη',
                        ErrorMessage: e.toString()
                    })
                } else {
                    if (results.length > 0) {
                        if (bcrypt.compareSync(password, results[0].password)) {
                            var sess = req.session;
                            sess.email = emailInput;
                            sess.userid = results[0].id;
                            res.redirect(url);
                        }
                        else {
                            res.render('login.ejs', {
                                login: false,
                                title: "Είσοδος",
                                message: "Λάθος κωδικός!"
                            });
                        }
                    }
                    else {
                        res.render('login.ejs', {
                            login: false,
                            title: "Είσοδος",
                            message: "To email που χρησιμοποίησες δεν βρέθηκε!"
                        });
                    }
                }
            });
        }
    },
    signupGET: function (req, res) {
        return res.render('signup.ejs', {
            login: false,
            title: "Εγγραφή"
        })
    },
    signupPOST: function (req, res) {
        let emailInput = req.body.emailInput;
        let password = req.body.passwordInput;
        let passwordconfirm = req.body.confirmPasswordInput;
        let name = req.body.name;
        let surname = req.body.name;
        let uploadedFile;
        let image_name;
        if (req.files != undefined && req.files.image != null) {
            uploadedFile = req.files.image;
            image_name = uploadedFile.name;
            // check type. should be png or jpeg
            if (!(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg')) {
                return res.render("ErrorPage.ejs", {
                    login: req.session.login,
                    name: req.session.email,
                    title: 'Η Σελίδα δεν είναι διαθέσιμη',
                    ErrorMessage: "Ο τύπος εικόνας δεν υποστηρίζεται!"
                })
            }
            // how the file will be stored (png regardless)
            image_name = emailInput + '.png'; 
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
        // server side validation, make sure passwords match
        if (password != passwordconfirm && password.length > 8) {
            return res.render("signup.ejs", {
                login: false,
                title: "Εγγραφή"
            });
        }
        // check if email exists
        dbUser.returnUser((emailInput), function (e, results, fields) {
            if (e) {
                res.render("ErrorPage.ejs", {
                    login: req.session.login,
                    name: req.session.email,
                    title: 'Η Σελίδα δεν είναι διαθέσιμη',
                    ErrorMessage: e.toString()
                })
            } else {
                // send error if exists
                if (results.length > 0) {
                    return res.render("signup.ejs", {
                        login: false,
                        title: "Εγγραφή"
                    });
                }
                // else create new user
                else {
                    //insert user
                    //first encrypt password
                    var EncryptedPass = bcrypt.hashSync(password, saltRounds);
                    dbUser.insertUser({
                        email: emailInput,
                        password: EncryptedPass,
                        name: name,
                        surname: surname
                    }, (e, result) => {
                        if (e) {
                            return res.render("ErrorPage.ejs", {
                                login: req.session.login,
                                name: req.session.email,
                                title: 'Η Σελίδα δεν είναι διαθέσιμη',
                                ErrorMessage: e.toString()
                            })
                        } else {
                            // if no error, return to home page logged in
                            var sess = req.session;
                            sess.email = emailInput;
                            return res.redirect('/');
                        }
                    });
                }
            }
        });
    },
    logout: function (req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}