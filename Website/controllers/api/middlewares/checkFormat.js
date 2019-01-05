module.exports = {
    checkFormat : function (req, res, next) {
        let format = req.query.format;
        if (format=='json' || format==null){
            next();
        }
        else{
            return res.status(400).send('Bad Request');
        }
    }
}