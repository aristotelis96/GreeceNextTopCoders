const db = require(appDir + '/models/shops.js');

module.exports = {
    getShops: function (req, res) {
        let start = parseInt(req.query.start);
        if(isNaN(start))
            start = 0;
        let count = parseInt(req.query.count);
        if(isNaN(count))
            count = 20;
        let status = req.query.status;
        if(status != 'ALL' && status != 'WITHDRAWN')
            status = 'ACTIVE';
        let sort = req.query.sort;
        if(sort != 'id|ASC' && sort != 'name|ASC' && sort != 'name|DESC')
            sort = 'id|DESC';
        (async ()=>{
            const util = require('util');
            var result;
            try{
                let [column, AscDesc] = sort.split('|');                
                result = await (util.promisify(db.getAllShops))({
                    status: status,
                    sort: {column: column, AscDesc: AscDesc}
                });
            } catch (e){
                return res.status(500).send('Internal Server Error ' + e.toString());
            }
            apiResult = {};
            apiResult.start = start;
            apiResult.count = count;
            apiResult.total = result.length;
            apiResult.shops = [];
            let i;
            let end = parseInt(start)+parseInt(count);
            for(i=start; (i<end) && (i<result.length); i++)
                apiResult.shops.push(result[i]);
            return res.status(200).json(apiResult);
        })();
    }
}