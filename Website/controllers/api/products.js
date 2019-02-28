const db = require(appDir + '/models/products.js');
const auth = require('./authentication');
const util = require('util');

getProducts =  function (req, res) {
    var id = req.params.id;
    
    if(id!=null){ // if id was provided in URL (ex. GET /shops/id?..) return specific shop
        let apiResult = {};
        if(isNaN(id)){
            return res.status(400).send({message: "Bad request", err: "id is NaN"});
        }
        return db.returnProductById(id, (err, result)=>{
            if(err){
                return res.status(500).send({message: "internal server error", err: err})
            } else {
                if(result.length == 0){
                    return res.status(404).send({message: "Id not found"});
                }
                let withdrawn;
                if (result[0].withdrawn == 0) withdrawn = false; else withdrawn = true;
                apiResult = {
                    id: result[0].id,
                    name: result[0].name,
                    description: result[0].description,
                    category: result[0].category,
                    extra_data: result[0].extra_data,
                    tags: result[0].tags,
                    withdrawn: withdrawn
                }
                return res.status(200).send(apiResult);
            }
        })
    }
    let start = parseInt(req.query.start);
    if (isNaN(start))
        start = 0;
    let count = parseInt(req.query.count);
    if (isNaN(count))
        count = 20;
    let sort = req.query.sort;
    if (sort != 'id|ASC' && sort != 'name|ASC' && sort != 'name|DESC')
        sort = 'id|DESC';
    let status = req.query.status;
    if (status != 'ALL' && status != 'WITHDRAWN')
        status = 'ACTIVE';
    if(req.params.id!=null)
        status = 'ALL'; // if user requested specific product we need to search for everything
    
    (async () => {
        var result;
        try {
            let [column, AscDesc] = sort.split('|'); // <- nice 
            result = await (util.promisify(db.getAllProductsWithFields))({
                status: status,
                sort: { column: column, AscDesc: AscDesc }
            });
        } catch (e) {
            return res.status(500).send({message: "Internal server error", err: e});
        }
        apiResult = {};
        apiResult.start = start;
        apiResult.count = count;
        apiResult.total = result.length;
        apiResult.products = [];
        let i;
        let end = parseInt(start) + parseInt(count);
        for (i = start; (i < end) && (i < result.length); i++) {
            let withdrawn;
            if (result[i].withdrawn == 0) withdrawn = false; else withdrawn = true;
            apiResult.products.push({
                id: result[i].id,
                name: result[i].name,
                description: result[i].description,
                category: result[i].category,
                extra_data: result[i].extra_data,
                tags: result[i].tags,
                withdrawn: withdrawn
            });
        }
        return res.status(200).json(apiResult);
    })();
}
module.exports = {getProducts}