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
            dbUser.returnUser(emailInput, function (error, results) {
                if (error) {
                    console.error("error ocurred in database during Login", error);
                    res.send({
                        "code": 400,
                        "failed": "error ocurred"
                    })
                } else {
                    if (results.length > 0) {
                        if (bcrypt.compareSync(password, results[0].password)) {
                            var sess = req.session;
                            sess.email = emailInput;
                            res.redirect('/');
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
        let shop_or_user = req.body.shop_or_user;
        let emailInput = req.body.emailInput;
        let password = req.body.passwordInput;
        let passwordconfirm = req.body.confirmPasswordInput;
        let name = req.body.name;
        let surname = req.body.name;        
        if (shop_or_user == "user") {
            let uploadedFile;
            let image_name;
            let fileExtension;
            if (req.files != undefined && req.files.image != null) {
                uploadedFile = req.files.image;
                image_name = uploadedFile.name;
                // check type. should be png or jpeg
                fileExtension = uploadedFile.mimetype.split('/')[1];
                if (!(uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg')) {
                    return res.render('signup.ejs', {
                        title: "GNTC",
                        login: false
                    })
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

            } else { //give him anonymous image
                image_name = 'anonymous.png';
            }
            // server side validation, make sure passwords match
            if (password != passwordconfirm && password.length > 8) {
                return res.render("signup.ejs", {
                    login: false,
                    title: "Εγγραφή"
                });
            }
            // check if email exists
            dbUser.returnUser((emailInput), function (error, results, fields) {
                if (error) {
                    return res.send({
                        "code": 400,
                        "failed": "error ocurred a@t database query"
                    });
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
                            image: image_name,
                            user_or_shop: "user",
                            name: name,
                            surname: surname}, (err, result) => {
                            if (err) {
                                return res.send(err);
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
        }
        else if (shop_or_user == "shop") {
            let new_or_existing = req.body.new_existing;
            let shopName = req.body.shopName;
            let periferia = req.body.periferia;
            if (periferia != undefined)
                periferia = periferia.replace('string:', '');
            let poli = req.body.poli;
            if (poli != undefined)
                poli = poli.replace('string:', '');
            let phone = req.body.phone;
            let lng = req.body.lng;
            let lat = req.body.lat;
            if (new_or_existing == "new") {
                // make sure shop doesnt exist
                const util = require('util'); //use of util.promisify();
                async function checkAndInsert(){
                    try{
                        //make sure at least Shop name is provided (client also checks this)
                        if(shopName == null || shopName== undefined)
                            throw new Error('shopname is null!!');
                        //check shop
                        let shop = await (util.promisify(dbShop.returnExactShop))({
                            name: shopName, 
                            phone: phone,
                            lng : lng,
                            lat: lat,
                            periferia: periferia,
                            city: poli
                        });
                        if(shop.length>0){
                            throw new Error('Shop already existing');
                        }
                        //check user
                        let user = await (util.promisify(dbUser.returnUser))(emailInput);
                        if(user.length>0){
                            throw new Error('User already existing');
                        }
                        let EncryptedPass = bcrypt.hashSync(password, saltRounds);
                        let newShop = await (util.promisify(dbShop.insertShop))({
                            name: shopName,
                            periferia: periferia, 
                            poli: poli, 
                            phone: phone, 
                            lng: lng,
                            lat: lat});
                        await (util.promisify(dbUser.insertUser))({
                                email: emailInput, 
                                password: EncryptedPass, 
                                user_or_shop : 'user',
                                image: 'anonymous.png',
                                name: name,
                                surname: surname,
                                shopID: newShop.insertId
                            });
                        var sess = req.session;
                        sess.email = emailInput;
                        res.redirect('/');
                    }
                    catch (e){
                        res.send(e.toString());
                    }
                }
                checkAndInsert();
            }
            else if (new_or_existing == "existing") {
                const util = require('util');
                async function checkAndInsert(){
                    try{
                        //check that user is new
                        let user = await (util.promisify(dbUser.returnUser))(emailInput);
                        if(user.length>0){
                            throw new Error('User already existing');
                        }
                        //check shop is unique
                        let shop = await (util.promisify(dbShop.returnExactShop))({
                            name: shopName,
                            periferia: periferia,
                            city: poli,
                            phone: phone,
                            lng: lng,
                            lat: lat
                        })
                        if(shop.length!=1){
                            throw new Error('Found more than one shop or shop doesnt exist');
                        }
                        // insert user with shop's ID
                        let EncryptedPass = bcrypt.hashSync(password, saltRounds);
                        await (util.promisify(dbUser.insertUser))({
                            email: emailInput,
                            password: EncryptedPass,
                            image: 'anonymous.png',
                            user_or_shop: shop_or_user,
                            name: name, 
                            surname: surname,
                            shopID: shop[0].id
                        })
                        var sess = req.session;
                        sess.email = emailInput;
                        res.redirect('/');

                    }
                    catch(e){
                        res.send(e.toString());
                    }
                }
                checkAndInsert();
            }
            else {
                console.log("reached unreachable") //do nothin
                res.redirect('/');
            }        
        }
        else {
            res.redirect('/'); //unreachable
        }
    },
    logout: function (req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}