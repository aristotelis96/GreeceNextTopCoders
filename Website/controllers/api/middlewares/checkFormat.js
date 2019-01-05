module.exports = {
    checkFormat : function (req, res, next) {
        let format = req.query.format;
        if (format=='xml'){
            return res.status(400).send('Bad Request');
        }
        else{
            next();
        }
    }
}