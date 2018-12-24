/* checks if an email exists in the database and returns a true or false flag in JSON format */
const db = require(appDir + '/models/users');

module.exports = {
    check_user: function (req, res) {
        var email = req.query.email;
        db.returnUser((email), (err, result) => {
            if(err){
                console.error("error in check_user.js DB access");
            } else {
                if(result.length == 0){
                    res.send({exists: false});
                } else {
                    res.send({exists: true});
                }
            }
        });

    }
}